import { TCompressionLevel } from "@/popup/App";
import { summarizeText } from "@/scripts/summarize-text";

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarize-text",
        title: "Summarize with AI",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === "summarize-text") {
        const {
            aiModel = "groq/compound-mini",
            compressionLevel = "Low",
            apiKey,
        } = (await chrome.storage.local.get([
            "aiModel",
            "compressionLevel",
            "apiKey",
        ])) as {
            aiModel?: string;
            compressionLevel?: TCompressionLevel;
            apiKey?: string;
        };

        if (!apiKey) {
            console.error("API key does not exist!");
            return;
        }

        const res = await summarizeText(
            info!.selectionText!,
            aiModel,
            compressionLevel,
            apiKey,
        );

        await chrome.storage.local.set({
            originalSummarizedText: info!.selectionText!,
            summary: res,
            compressionLevel,
        });

        chrome.action.openPopup();
    }
});

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
        const res = await summarizeText(info!.selectionText!);

        chrome.action.openPopup(() => {
            setTimeout(async () => {
                await chrome.storage.local.set({ summary: res });
            }, 100);
        });
    }
});

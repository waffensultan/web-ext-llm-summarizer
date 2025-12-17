import { useState, useEffect } from "react";
import { CopyIcon, EyeClosedIcon, EyeIcon, SettingsIcon } from "lucide-react";
import { summarizeText } from "@/scripts/summarize-text";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type TCompressionLevel = "Low" | "Medium" | "High";
export default function App() {
    const [originalText, setOriginalText] = useState<string | undefined>(
        undefined,
    );
    const [summarizedText, setSummarizedText] = useState<{
        originalSummarizedText: string;
        content: string;
        compressionLevel: TCompressionLevel | undefined;
    }>({
        originalSummarizedText: "",
        content: "",
        compressionLevel: "Low",
    });
    const [showApiKey, setShowApiKey] = useState(false);
    const [settingsIsOpen, setSettingsIsOpen] = useState(false);
    const [settings, setSettings] = useState<{
        aiModel: string;
        compressionLevel: TCompressionLevel;
        apiKey: string;
    }>({
        aiModel: "groq/compound-mini",
        compressionLevel: "Low",
        apiKey: "",
    });
    const [draftSettings, setDraftSettings] = useState<{
        aiModel: string;
        compressionLevel: TCompressionLevel;
        apiKey: string;
    }>({
        aiModel: settings?.aiModel,
        compressionLevel: settings.compressionLevel,
        apiKey: settings?.apiKey,
    });

    useEffect(function retrieveApiKey() {
        if (chrome?.storage?.local) {
            chrome.storage.local.get(["apiKey"], (result) => {
                if (result.apiKey && typeof result.apiKey === "string") {
                    const apiKey = result.apiKey as string;

                    setSettings((prev) => ({ ...prev, apiKey: apiKey }));
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!chrome?.storage?.local) return;

        let isMounted = true;

        async function retrieveSummary() {
            const stored = (await chrome.storage.local.get([
                "originalSummarizedText",
                "summary",
                "compressionLevel",
            ])) as {
                originalSummarizedText?: string;
                summary?: string;
                compressionLevel?: TCompressionLevel;
            };

            if (!isMounted) return;

            setSummarizedText({
                originalSummarizedText: stored.originalSummarizedText || "",
                content: stored.summary || "",
                compressionLevel: stored.compressionLevel || "Low",
            });
        }

        const handleStorageChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            areaName: string,
        ) => {
            if (areaName === "local") {
                const originalSummarizedText =
                    changes.originalSummarizedText?.newValue;
                const updatedSummary = changes.summary?.newValue;
                const updatedCompression = changes.compressionLevel?.newValue;

                if (
                    typeof originalSummarizedText === "string" &&
                    typeof updatedSummary === "string" &&
                    typeof updatedCompression === "string"
                ) {
                    setSummarizedText({
                        originalSummarizedText: originalSummarizedText,
                        content: updatedSummary,
                        compressionLevel:
                            updatedCompression as TCompressionLevel,
                    });
                }
            }
        };

        retrieveSummary();
        chrome.storage.local.onChanged.addListener(handleStorageChange);

        return () => {
            isMounted = false;
            chrome.storage.local.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    const handleDraftSettingsChange = ({
        type,
        value,
    }: {
        type: "aiModel" | "compressionLevel" | "apiKey";
        value: string;
    }) => {
        setDraftSettings((prev) => ({ ...prev, [type]: value }));
    };

    const handleSummarizeText = async () => {
        const res = await summarizeText(
            originalText || summarizedText.originalSummarizedText,
            settings.aiModel,
            settings.compressionLevel,
            settings.apiKey,
        );

        if (chrome?.storage?.local) {
            const summarized = {
                originalSummarizedText:
                    originalText || summarizedText.originalSummarizedText,
                summary: res,
                compressionLevel: settings.compressionLevel,
            };

            // Save it in storage
            chrome.storage.local.set({
                ...summarized,
            });

            // Directly update the UI
            setSummarizedText({
                originalSummarizedText: originalText ?? "",
                content: summarized.summary,
                compressionLevel: summarized.compressionLevel,
            });
        }
    };

    const discardDraftSettings = () => {
        setDraftSettings(settings);
        setSettingsIsOpen(false);
    };

    const saveDraftSettings = () => {
        setSettings(draftSettings);

        chrome.storage.local.set({
            ...draftSettings,
        });
    };

    const originalLength = summarizedText.originalSummarizedText.length;
    const summarizedLength = summarizedText.content.length;

    const compressionRatio =
        originalLength > 0
            ? Math.min((summarizedLength / originalLength) * 100, 100)
            : 0; // in percentage
    const reductionPercentage =
        originalLength > 0
            ? Math.round(
                  100 - (summarizedText.content.length / originalLength) * 100,
              )
            : 0;

    return (
        <main className="w-[600px] h-full bg-[#FDFDFD] text-black font-poppins py-3 px-3 flex-col">
            <nav>
                <ul className="flex items-center justify-between">
                    <li className="flex gap-2 items-center">
                        <img
                            src="/tutorials-dojo-logo.png"
                            className="w-10 h-10"
                        />
                        <div className="flex flex-col">
                            <h1 className="font-semibold text-2xl">
                                AI Text Summarizer
                            </h1>
                            <span className="text-neutral-600 -mt-0.5">
                                by TutorialsDojo x Waffen Sultan
                            </span>
                        </div>
                    </li>
                    <li>
                        <Dialog
                            open={settingsIsOpen}
                            onOpenChange={setSettingsIsOpen}
                        >
                            <DialogTrigger
                                onClick={() => discardDraftSettings()}
                            >
                                <SettingsIcon className="cursor-pointer" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle className="text-2xl">
                                    Extension Configuration
                                </DialogTitle>
                                <hr className="text-[#D9D9D9] my-1" />
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-lg tracking-tight">
                                            AI Model
                                        </span>
                                        <Select
                                            defaultValue={settings?.aiModel}
                                            onValueChange={(value) =>
                                                handleDraftSettingsChange({
                                                    type: "aiModel",
                                                    value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        settings?.aiModel
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="groq/compound-mini">
                                                        groq/compound-mini
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <span>
                                            Select which AI model to utilize for
                                            summarization.
                                        </span>
                                    </div>
                                    {/*API KEY INPUT*/}
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-lg tracking-tight">
                                            API Key
                                        </span>
                                        <div className="flex flex-row items-center gap-3">
                                            <Input
                                                type={
                                                    showApiKey
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your API key here..."
                                                value={draftSettings.apiKey}
                                                onChange={(e) =>
                                                    handleDraftSettingsChange({
                                                        type: "apiKey",
                                                        value: e.target.value,
                                                    })
                                                }
                                            />
                                            {!showApiKey ? (
                                                <EyeIcon
                                                    className="cursor-pointer "
                                                    onClick={() =>
                                                        setShowApiKey(true)
                                                    }
                                                />
                                            ) : (
                                                <EyeClosedIcon
                                                    className="cursor-pointer text-gray-500"
                                                    onClick={() =>
                                                        setShowApiKey(false)
                                                    }
                                                />
                                            )}
                                        </div>
                                        <span>
                                            Your API key is stored locally and
                                            never sent to our servers.
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-lg tracking-tight">
                                            Compression Level
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {(
                                                [
                                                    "Low",
                                                    "Medium",
                                                    "High",
                                                ] as TCompressionLevel[]
                                            ).map((compressionLevel) => (
                                                <button
                                                    onClick={() =>
                                                        handleDraftSettingsChange(
                                                            {
                                                                type: "compressionLevel",
                                                                value: compressionLevel,
                                                            },
                                                        )
                                                    }
                                                    className={`duration-150 cursor-pointer font-semibold border border-gray-200 rounded-md py-1 w-14 flex items-center justify-center ${draftSettings?.compressionLevel === compressionLevel && "bg-gray-300 text-neutral-500"}`}
                                                >
                                                    {compressionLevel}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center gap-2">
                                        <button
                                            onClick={() =>
                                                discardDraftSettings()
                                            }
                                            className="cursor-pointer flex justify-center items-center gap-1 border duration-150 border-red-600 hover:bg-red-600 hover:text-white rounded-md text-red-500 font-semibold py-2 px-4"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSettingsIsOpen(false);
                                                saveDraftSettings();
                                            }}
                                            className="cursor-pointer flex justify-center items-center gap-1 bg-blue-500 rounded-md text-white font-semibold py-2 px-4"
                                        >
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </li>
                </ul>
            </nav>
            <hr className="text-[#D9D9D9] my-3" />
            <div className="flex w-full gap-3">
                {/*ORIGINAL SECTION*/}
                <div className="flex flex-col w-[40%] gap-1">
                    <div className="w-full flex justify-between">
                        <h4 className="font-semibold">Original</h4>
                        <span className="text-[#A49E9E]">
                            {originalText !== undefined
                                ? originalText.length
                                : summarizedText.originalSummarizedText
                                      .length}{" "}
                            chars
                        </span>
                    </div>
                    <textarea
                        className="p-2 bg-white border border-[#D9D9D9] h-[300px] rounded-md resize-none duration-150 outline-blue-100 focus:outline-blue-500"
                        // value={originalText}
                        value={
                            originalText !== undefined
                                ? originalText
                                : summarizedText.originalSummarizedText
                        }
                        onChange={(e) => setOriginalText(e.target.value)}
                    />
                </div>
                {/*SUMMARY SECTION*/}
                <div className="flex flex-col w-[60%] gap-1">
                    <div className="w-full flex justify-between">
                        <h4 className="font-semibold">Summary</h4>
                        <span className="text-[#A49E9E]">
                            {reductionPercentage >= 0 ? reductionPercentage : 0}
                            % reduction
                        </span>
                    </div>
                    <div className="flex flex-col p-2 bg-white border border-[#D9D9D9] rounded-md h-[300px]">
                        <textarea
                            className="resize-none h-full"
                            disabled
                            value={summarizedText.content}
                        />

                        <hr className="text-[#D9D9D9] my-3" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[#A49E9E]">
                                Compression Level:{" "}
                                {(() => {
                                    const compressionColors: Record<
                                        TCompressionLevel,
                                        string
                                    > = {
                                        Low: "text-gray-400",
                                        Medium: "text-orange-500",
                                        High: "text-red-500",
                                    };

                                    return (
                                        <span
                                            className={`${compressionColors[summarizedText.compressionLevel ?? "Low"]} font-semibold`}
                                        >
                                            {summarizedText.compressionLevel ??
                                                "None"}
                                        </span>
                                    );
                                })()}
                            </span>

                            <div className="w-full rounded-md h-2 bg-gray-400 relative">
                                <div
                                    className="bg-blue-500 h-full rounded-md transition-all duration-300"
                                    style={{ width: `${compressionRatio}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleSummarizeText()}
                            className="cursor-pointer flex justify-center items-center gap-1 w-full bg-blue-500 duration-150 rounded-md text-white font-semibold py-2"
                        >
                            <span>Summarize</span>
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    summarizedText.content,
                                );
                                window.alert("Successfully copied text!");
                            }}
                            className="border border-[#D9D9D9] rounded-md py-1 px-2 cursor-pointer"
                        >
                            <CopyIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

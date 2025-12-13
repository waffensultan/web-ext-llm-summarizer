import { useState, useEffect } from "react";
import {
    CopyIcon,
    EyeClosedIcon,
    EyeIcon,
    RepeatIcon,
    SettingsIcon,
} from "lucide-react";
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

type TCompressionLevel = "Low" | "Medium" | "High";
export default function App() {
    const [originalText, setOriginalText] = useState("");
    const [summarizedText, setSummarizedText] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [settings, setSettings] = useState<{
        aiModel: string;
        compressionLevel: TCompressionLevel;
    }>({
        aiModel: "OpenAI",
        compressionLevel: "Low",
    });

    function useSummaryWatcher() {
        if (chrome?.storage?.local) {
            // INITIAL RETRIEVAL OF TEXT
            chrome.storage.local.get("summary", (res) => {
                if (res && typeof res.summary === "string") {
                    setSummarizedText(res.summary);
                }
            });

            // LISTEN FOR CHANGES
            chrome.storage.local.onChanged.addListener((changes) => {
                if (changes && typeof changes.summary === "string") {
                    setSummarizedText(changes.summary);
                }
            });
        }
    }

    useEffect(useSummaryWatcher, []);

    const handleSummarizeText = async () => {
        const res = await summarizeText(originalText);

        if (chrome?.storage?.local) {
            chrome.storage.local.set({ summary: res });
        }
    };

    return (
        <main className="w-[600px] h-full bg-[#FDFDFD] text-black font-poppins py-5 px-3 flex-col">
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
                        <Dialog>
                            <DialogTrigger>
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
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    aiModel: value,
                                                }))
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
                                                    <SelectItem value="OpenAI">
                                                        OpenAI
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
                                                    !showApiKey
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your API key here..."
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
                                    <div className="flex justify-end items-center gap-2">
                                        <button className="cursor-pointer flex justify-center items-center gap-1 border duration-150 border-red-600 hover:bg-red-600 hover:text-white rounded-md text-red-500 font-semibold py-2 px-4">
                                            Discard
                                        </button>
                                        <button className="cursor-pointer flex justify-center items-center gap-1 bg-blue-500 rounded-md text-white font-semibold py-2 px-4">
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
                            {originalText.length} chars
                        </span>
                    </div>
                    <textarea
                        className="p-2 bg-white border border-[#D9D9D9] h-[300px] rounded-md resize-none duration-150 outline-blue-100 focus:outline-blue-500"
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                    />
                </div>
                {/*SUMMARY SECTION*/}
                <div className="flex flex-col w-[60%] gap-1">
                    <div className="w-full flex justify-between">
                        <h4 className="font-semibold">Summary</h4>
                        <span className="text-[#A49E9E]">
                            % reduction (TODO)
                        </span>
                    </div>
                    <div className="flex flex-col p-2 bg-white border border-[#D9D9D9] rounded-md h-[300px]">
                        <textarea
                            className="resize-none h-full"
                            disabled
                            value={summarizedText}
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
                                            className={`${compressionColors[settings?.compressionLevel]} font-semibold`}
                                        >
                                            {settings?.compressionLevel}
                                        </span>
                                    );
                                })()}
                            </span>

                            <div className="w-full rounded-md h-2 flex">
                                <div className="w-[50%] bg-blue-500 rounded-l-md"></div>
                                <div className="bg-gray-400 w-full rounded-r-md"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleSummarizeText()}
                            className="cursor-pointer flex justify-center items-center gap-1 w-full bg-blue-500 rounded-md text-white font-semibold py-2"
                        >
                            <span>Summarize</span>
                        </button>
                        <button className="border border-[#D9D9D9] rounded-md py-1 px-2">
                            <CopyIcon size={20} />
                        </button>
                        <button
                            onClick={() => handleSummarizeText()}
                            className="border border-[#D9D9D9] rounded-md py-1 px-2"
                        >
                            <RepeatIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

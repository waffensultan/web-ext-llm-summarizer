import { useState, useEffect } from "react";
import { CopyIcon, RepeatIcon, SettingsIcon } from "lucide-react";
import { summarizeText } from "@/scripts/summarize-text";

export default function App() {
    const [originalText, setOriginalText] = useState("");
    const [summarizedText, setSummarizedText] = useState("");

    useEffect(function useSummaryWatcher() {
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
    }, []);

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
                                by TutoriasDojo x Waffen Sultan
                            </span>
                        </div>
                    </li>
                    <li>
                        <button>
                            <SettingsIcon />
                        </button>
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
                        className="p-2 bg-white border border-[#D9D9D9] rounded-md resize-none duration-150 outline-blue-100 focus:outline-blue-500"
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        rows={15}
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
                    <textarea
                        className="p-2 bg-white border border-[#D9D9D9] rounded-md resize-none duration-150 outline-blue-100 focus:outline-blue-500"
                        disabled
                        value={summarizedText}
                        rows={15}
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleSummarizeText()}
                            className="flex justify-center items-center gap-1 w-full bg-blue-500 rounded-md text-white font-semibold py-2"
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

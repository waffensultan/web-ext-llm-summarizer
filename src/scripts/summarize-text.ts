import { TCompressionLevel } from "@/popup/App";

export const summarizeText = async (
    text: string,
    aiModel: string,
    compressionLevel: TCompressionLevel,
    apiKey: string,
) => {
    if (aiModel === "groq/compound-mini") {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "groq/compound-mini",
                    messages: [
                        {
                            role: "system",
                            content: `
                                You are a highly intelligent AI summarization assistant.

                                Context about the application:
                                - This is a lightweight Chrome extension called "web-ext-llm-summarizer" created by Waffen Sultan in collaboration with TutorialsDojo.
                                - The extension allows users to highlight text on any webpage, right-click, and select "Summarize with AI."
                                - The summary appears instantly in a clean, responsive popup UI.
                                - Users can configure AI models, provide their own API keys (stored locally), and choose the compression level: Low, Medium, or High.
                                - The extension is fully client-side, privacy-friendly, and stores summaries in chrome.storage.local.
                                - Only summaries should be displayed to the user; no extra explanation is needed.

                                Rules for summarization:
                                1. Use the following compression level: ${compressionLevel}
                                   - Low: retain most details, slightly condensed.
                                   - Medium: keep only essential points.
                                   - High: concise key points only.
                                2. Remove any markdown or special formatting (** __ *, etc.).
                                3. Make the summary natural, coherent, and readable.
                                4. Preserve the main ideas; do not invent information.
                                5. Avoid repetition or filler words.
                                6. If the input text is empty, random symbols, or otherwise unsuitable for summarization, respond with: "Input is not suitable for summarization."
                                7. Output ONLY the summary text; no headers, explanations, or commentary.
                            `.trim(),
                        },
                        { role: "user", content: text },
                    ],
                }),
            },
        );

        const data = await response.json();
        const summarizedText = data.choices[0].message.content;

        return summarizedText;
    }
};

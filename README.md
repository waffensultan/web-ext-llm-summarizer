
# [web-ext-llm-summarizer](https://github.com/waffensultan/web-ext-llm-summarizer)

A lightweight Chrome extension that summarizes selected text using AI models of your choice.
Users can right-click any selected text, choose **“Summarize with AI”**, and instantly receive a concise summary inside the extension popup.

This repository serves as the **code companion** to a full tutorial article that walks through the architecture, APIs, and implementation details step by step.

## Features

* Context menu integration (`Summarize with AI` on text selection)
* Supports multiple AI models
* User-provided API keys (stored locally)
* Adjustable compression levels (Low / Medium / High)
* Clean, responsive popup UI built with React
* No backend required — runs fully client-side



## Download the Extension

You can download the ready-to-install version of the extension from the official release page:

**[Download v1.0.0](https://github.com/waffensultan/web-ext-llm-summarizer/releases/tag/1.0.0)**

After downloading the `.zip` file, extract it and load the `dist` folder in Chrome via **Developer mode → Load unpacked**.

## How It Works (High-Level)

1. The user selects text on any webpage
2. A custom Chrome context menu item appears
3. Clicking **“Summarize with AI”** sends the selected text to the summarization logic
4. The generated summary is stored in `chrome.storage.local`
5. The popup UI listens for updates and displays the summary instantly

This architecture keeps the extension fast, simple, and privacy-friendly.

## Tech Stack

* **Chrome Extensions API (Manifest V3)**
* **CRXJS**
* **Vite**
* **React + TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide Icons**
* **AI APIs (model-agnostic design)**

## Project Structure (Simplified)

```
src/
├─ scripts/
│  └─ summarize-text.ts     # Core AI summarization logic
├─ components/
│  └─ ui/                   # Reusable UI components
├─ App.tsx                  # Popup UI
├─ background.ts            # Context menu + event listeners
└─ manifest.json
```

## Installation (Development)

1. Clone the repository:

   ```bash
   git clone https://github.com/waffensultan/web-ext-llm-summarizer.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load it into Chrome:

   * Open `chrome://extensions`
   * Enable **Developer mode**
   * Click **Load unpacked**
   * Select the `dist` folder

## Usage

1. Highlight text on any webpage
2. Right-click and select **Summarize with AI**
3. Click the extension icon to view the summary
4. Adjust AI model, API key, and compression level in settings

## API Keys & Privacy

* API keys are **stored locally** using `chrome.storage`
* Keys are **never sent to any external server**
* All requests go directly from the extension to the selected AI provider

## Tutorial Article

This repository is intentionally focused on code.
For a complete walkthrough — including design decisions, Chrome extension APIs, and AI integration — read the full tutorial:

**[Tutorial link coming soon]**

## Future Improvements

* Additional AI providers
* Token and cost estimation
* Streaming responses
* Summary history
* Export and share options

## License

MIT License

## Credits

Built by **Waffen Sultan**
In collaboration with **TutorialsDojo**

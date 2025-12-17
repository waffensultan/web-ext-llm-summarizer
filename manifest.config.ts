import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    icons: {
        "16": "public/icon16.png",
        "32": "public/icon32.png",
        "48": "public/icon48.png",
        "128": "public/icon128.png",
    },
    action: {
        default_icon: {
            "16": "public/icon16.png",
            "32": "public/icon32.png",
            "48": "public/icon48.png",
            "128": "public/icon128.png",
        },
        default_popup: "src/popup/index.html",
    },
    permissions: ["contentSettings", "contextMenus", "storage"],
    background: {
        service_worker: "src/background/index.ts",
        type: "module",
    },
});

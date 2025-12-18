// background/serviceWorker.js
import { initDefaults } from "../storage/store.js";

chrome.runtime.onInstalled.addListener(() => {
    initDefaults();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "RL_TAB_STATE") {
        // aggregate signals if needed
        sendResponse({ ok: true });
    }
});

import { initDefaults } from "../storage/store.js";

chrome.runtime.onInstalled.addListener(() => {
    initDefaults();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "RL_TAB_STATE") {
        //to aggregate signals if we needed it.
        sendResponse({ ok: true });
    }
});
 
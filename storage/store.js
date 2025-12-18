// storage/store.js
export function initDefaults() {
    chrome.storage.local.set({
        rl_settings: {
            enabled: true,
            intensity: 0.7,
            privacyMode: true,
            frictionInjection: true
        }
    });
}

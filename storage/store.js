export function initDefaults() {
    chrome.storage.local.set({
        rl_settings: {
            enabled: true,
            privacyMode: true,
            frictionInjection: true,
            intensity: 0.7
        }
    });
}

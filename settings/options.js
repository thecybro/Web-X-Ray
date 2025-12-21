export async function loadSettings() {
    const { rl_settings } = await chrome.storage.local.get("rl_settings");
    const s = rl_settings || {};
    document.getElementById("enabled").checked = s.enabled ?? true;
    document.getElementById("privacyMode").checked = s.privacyMode ?? true;
    document.getElementById("frictionInjection").checked = s.frictionInjection ?? true;
    document.getElementById("intensity").value = s.intensity ?? 0.7;
}

document.getElementById("save").addEventListener("click", async () => {
    const s = {
        enabled: document.getElementById("enabled").checked,
        privacyMode: document.getElementById("privacyMode").checked,
        frictionInjection: document.getElementById("frictionInjection").checked,
        intensity: Number(document.getElementById("intensity").value)
    };
    await chrome.storage.local.set({ rl_settings: s });
});

loadSettings();

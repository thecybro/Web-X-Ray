// content/content.js
(async function main() {
    console.log("Web X-Ray has been injected on:", location.href)

    const { rl_settings } = await chrome.storage.local.get("rl_settings");
    const cfg = rl_settings || { enabled: true, intensity: 0.7 };

    if (!cfg.enabled) return;

    // Importing modules dynamically, cuz yk..
    const { createObserver } = await import(chrome.runtime.getURL("content/utils/observe.js"));
    const { IntentEngine } = await import(chrome.runtime.getURL("content/intentEngine.js"));
    const { DomRewriter } = await import(chrome.runtime.getURL("content/domRewriter.js"));
    const { PolicyGraph } = await import(chrome.runtime.getURL("content/policyGraph.js"));
    const { detectAdapter } = await import(chrome.runtime.getURL("content/siteAdapters/genericAdapter.js"));

    const adapter = detectAdapter(location.href);
    const policy = new PolicyGraph(cfg, adapter.capabilities);
    const engine = new IntentEngine({ timeOfDay: new Date().getHours(), site: adapter.siteId });
    const rewriter = new DomRewriter(policy, adapter);

    const observer = createObserver((signal) => {
        const state = engine.ingest(signal);
        rewriter.apply(state);
        chrome.runtime.sendMessage({ type: "RL_TAB_STATE", payload: { state, url: location.href } }).catch(() => { });
    });

    
    adapter.prepare?.();
    observer.start();

    // content/content.js (inside main())
    function createDebugHUD() {
        const hud = document.createElement("div");
        hud.id = "rl-debug";
        hud.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: #0f0;
            font: 12px monospace;
            padding: 8px;
            border-radius: 6px;
            z-index: 999999;
        `;
        document.body.appendChild(hud);
        return hud;
    }

    const hud = createDebugHUD();

    observer.start();

    // Update HUD whenever state changes
    observer.start = () => {
        window.addEventListener("scroll", () => updateHUD());
        window.addEventListener("mousemove", () => updateHUD());
        document.addEventListener("selectionchange", () => updateHUD());
    };

    function updateHUD() {
        const state = engine.state;
        hud.textContent = Object.entries(state)
            .map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`)
            .join("\n");
    }

    console.log("Reality Layer content script injected on:", location.href);
    console.log("IntentEngine initialized:", engine);

    const state = engine.state;
    const summary = Object.entries(state)

    .map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`)
    .join(" | ");

    hud.textContent = summary;
    console.log("HUD update:", summary);

})();

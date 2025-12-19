(async function main() {
    const XRAY_TAG = "Web X-Ray";

    console.log(`${XRAY_TAG} injected on:`, location.href);

    // HARD visual proof.
    const badge = document.createElement("div");
    badge.textContent = "X-RAY ACTIVE";
    Object.assign(badge.style, {
        position: "fixed",
        bottom: "12px",
        right: "12px", 
        zIndex: 999999,
        background: "rgba(0,0,0,0.7)",
        color: "#00ffcc",
        padding: "6px 10px",
        fontSize: "12px",
        fontFamily: "monospace",
        borderRadius: "6px"
    }); 
    document.documentElement.appendChild(badge);

    const { rl_settings } = await chrome.storage.local.get("rl_settings");
    const cfg = rl_settings ?? { enabled: true, intensity: 0.7 };

    if (!cfg.enabled) {
        badge.textContent = "XRAY DISABLED";
        return;
    }

    // For dynamic imports with failures being visible
    let IntentEngine, DomRewriter, PolicyGraph, createObserver;

    try {
        ({ createObserver } = await import(chrome.runtime.getURL("content/utils/observe.js")));
        ({ IntentEngine } = await import(chrome.runtime.getURL("content/intentEngine.js")));
        ({ DomRewriter } = await import(chrome.runtime.getURL("content/domRewriter.js")));
        ({ PolicyGraph } = await import(chrome.runtime.getURL("content/policyGraph.js")));
    } catch (err) {
        console.error(`${XRAY_TAG} module load failure`, err);
        badge.textContent = "XRAY ERROR";
        return;
    }

    const policyGraph = new PolicyGraph();
    const engine = new IntentEngine({ intensity: cfg.intensity });
    const rewriter = new DomRewriter(policyGraph);

    console.log(`${XRAY_TAG} engine online`, engine);

    // To observe the intent of user
    createObserver(engine);

    // For live telemetry
    setInterval(() => {
        const state = engine.state;

        rewriter.apply(engine.state);

        const summary = Object.entries(state)
            .map(([k, v]) => `${k}:${Math.round(v * 100)}%`)
            .join(" ");

        badge.textContent = summary || "XRAY IDLE";
        console.log(`${XRAY_TAG} intent`, state);
    }, 500);

})();

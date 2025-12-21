export function createObserver(engine) {
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();

  window.addEventListener("scroll", () => {
    const now = performance.now();
    const dy = Math.abs(window.scrollY - lastScrollY);
    const dt = now - lastTime;

    if (dt > 0) {
      const velocity = Math.min(dy / dt, 0.6);
      engine.update("scrollVelocity", velocity);
    }
    
    lastScrollY = window.scrollY;
    lastTime = now;
  }, { passive: true });

  let hoverTimer = null;

  let lastMouseMove = Date.now();

  document.addEventListener("mousemove", e => {

    const now = Date.now();
    const dt = now - lastMouseMove;

    if (dt < 40) return; // To  ignore rapid movement.

    lastMouseMove = now;

    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      engine.update("hesitation", 0.15);
    }, 1200);
  });

  document.addEventListener("selectionchange", () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const text = document.getSelection()?.toString();
    if (text && text.length > 25) {
      engine.update("selection", 0.3);
      engine.update("hesitation", -0.2);
    }
  });
}

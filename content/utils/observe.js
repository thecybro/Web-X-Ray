export function createObserver(engine) {
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();

  window.addEventListener("scroll", () => {
    const now = performance.now();
    const dy = Math.abs(window.scrollY - lastScrollY);
    const dt = now - lastTime;

    if (dt > 0) {
      const velocity = Math.min(dy / dt, 0.5);
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
    lastMouseMove = now;

    if (dt < 40) return; // To  ignore rapid movement.

    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      engine.update("hesitation", 0.25);
    }, 1000);
  });

  document.addEventListener("selectionchange", () => {
    const text = document.getSelection()?.toString();
    if (text && text.length > 3) {
      engine.update("selection", 0.3);
      engine.update("hesitation", -0.2);
    }
  });
}

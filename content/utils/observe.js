export function createObserver(engine) {
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();

  window.addEventListener("scroll", () => {
    const now = performance.now();
    const dy = Math.abs(window.scrollY - lastScrollY);
    const dt = now - lastTime;

    if (dt > 0) {
      const velocity = Math.min(dy / dt, 2);
      engine.update("scrollVelocity", velocity);
    }
    
    lastScrollY = window.scrollY;
    lastTime = now;
  }, { passive: true });

  let hoverTimer = null;

  document.addEventListener("mousemove", e => {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      engine.update("hesitation", 1);
    }, 200);
  });

  document.addEventListener("selectionchange", () => {
    const text = document.getSelection()?.toString();
    if (text && text.length > 3) {
      engine.update("selection", 1);
    }
  });
}

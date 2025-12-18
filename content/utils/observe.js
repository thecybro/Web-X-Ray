// content/utils/observe.js
export function createObserver(onSignal) {
  console.log("Signal has been successfully captured:",onSignal({type,data}));

  let lastY = window.scrollY;
  let lastT = performance.now();
  let mouseLast = { x: 0, y: 0, t: performance.now() };
  let selectTimeout = null;
  let idleTimer = null;

  function emit(type, data) { 
    console.log("Signal captured:", type, data);
    
    onSignal({ type, data }); 
  }

  function resetIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => emit('idle', { seconds: 10 }), 10000);
  }

  function onScroll() {
    const now = performance.now();
    const dy = window.scrollY - lastY;
    const dt = now - lastT;
    lastY = window.scrollY;
    lastT = now;
    emit('scroll', { deltaY: dy, dt });
    resetIdle();
  }

  function onMouseMove(e) {
    const now = performance.now();
    const dx = e.clientX - mouseLast.x;
    const dy = e.clientY - mouseLast.y;
    mouseLast = { x: e.clientX, y: e.clientY, t: now };
    emit('mousemove', { dx, dy });
    resetIdle();
  }

  function onMousePause() {
    emit('hesitation', {});
  }

  function onSelection() {
    if (selectTimeout) clearTimeout(selectTimeout);
    selectTimeout = setTimeout(() => {
      const sel = window.getSelection();
      const len = sel ? String(sel).length : 0;
      if (len > 0) emit('select', { length: len });
    }, 300);
    resetIdle();
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden' || document.visibilityState === 'visible') {
      emit('tab', { state: document.visibilityState });
    }
  }

  let hesTimer = null;
  function scheduleHesitation() {
    if (hesTimer) clearTimeout(hesTimer);
    hesTimer = setTimeout(onMousePause, 1500);
  }

  return {
    start() {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('mousemove', (e) => { onMouseMove(e); scheduleHesitation(); }, { passive: true });
      document.addEventListener('selectionchange', onSelection);
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('keydown', resetIdle, { passive: true });
      resetIdle();
    },
    stop() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('selectionchange', onSelection);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('keydown', resetIdle);
      if (idleTimer) clearTimeout(idleTimer);
      if (hesTimer) clearTimeout(hesTimer);
    }
  };
}

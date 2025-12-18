export function applyDesaturation(root, level = 0.5) {
  root.style.filter = `saturate(${Math.max(0.3, 1 - level)}) grayscale(${Math.min(0.6, level)})`;
}

export function injectDelay(nodes = [], ms = 800) {
  nodes.forEach(n => {
    const orig = n.onclick;
    n.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      setTimeout(() => {
        if (orig) orig.call(n, e);
        n.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }, ms);
    }, { capture: true });
  });
}

export function tagClaims(root, { certainty = true } = {}) {
  const candidates = Array.from(root.querySelectorAll('p,article,blockquote')).slice(0, 40);
  candidates.forEach(el => {
    const text = el.textContent || '';
    if (text.split(' ').length > 20) {
      const badge = document.createElement('span');
      badge.textContent = certainty ? 'Claim: certainty est.' : 'Claim';
      badge.style.cssText = 'font-size:11px;padding:2px 6px;border-radius:10px;background:#eef;color:#334;margin-left:6px;';
      el.insertAdjacentElement('afterbegin', badge);
    }
  });
}

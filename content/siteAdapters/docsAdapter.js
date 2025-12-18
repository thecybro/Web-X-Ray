// content/siteAdapters/docsAdapter.js
export const docsAdapter = {
    siteId: 'docs',
    capabilities: { chapters: false, comments: false, playback: false },
    match(u) {
        // heuristic: article or docs-like pages
        return /doc|guide|blog|article|readthedocs|developer|docs/i.test(u.host + u.pathname);
    },
    reactiveInputs() { return Array.from(document.querySelectorAll('input, textarea')); },
    truncateFeed() { },
    disableAutoplay() { },
    titleNodes() { return Array.from(document.querySelectorAll('h1,h2,h3')); },
    suppressHooks() {
        const recs = document.querySelectorAll('.related, .recommended, nav .suggested');
        recs.forEach(el => el.style.display = 'none');
    },
    focusMain() {
        const main = document.querySelector('main,[role="main"],article');
        if (main) {
            main.style.maxWidth = '60ch';
            main.style.margin = '0 auto';
        }
    },
    reorderSections(by) {
        if (by !== 'salience') return;
        const headers = Array.from(document.querySelectorAll('h2,h3'));
        headers.sort((a, b) => (scoreSection(b) - scoreSection(a)));
        function scoreSection(h) {
            const section = h.nextElementSibling;
            const len = section ? (section.textContent || '').length : 0;
            const links = section ? section.querySelectorAll('a').length : 0;
            return links * 2 + Math.min(500, len) / 100;
        }
        const container = document.querySelector('main, article, .content');
        headers.forEach(h => { if (container) container.appendChild(h); });
    },
    collapseThreads() { },
    prioritizeFacts() {
        // Bolden code blocks, tables and definitions
        const code = document.querySelectorAll('pre, code');
        code.forEach(el => el.style.filter = 'contrast(1.15)');
        const tables = document.querySelectorAll('table');
        tables.forEach(t => t.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.05)');
    }
};

// content/siteAdapters/youtubeAdapter.js
export const youtubeAdapter = {
    siteId: 'youtube',
    capabilities: { chapters: true, comments: true, playback: true },
    prepare() {
        // Disable autoplay invisibly (UI untouched)
        const tryDisable = () => {
            const toggle = document.querySelector('button[aria-label*="Autoplay"]');
            if (toggle && toggle.getAttribute('aria-pressed') === 'true') toggle.click();
        };
        setInterval(tryDisable, 2000);
    },
    reactiveInputs() { return []; },
    truncateFeed(count) {
        const items = document.querySelectorAll('ytd-rich-item-renderer,ytd-compact-video-renderer');
        items.forEach((el, i) => { if (i >= count) el.style.display = 'none'; });
    },
    disableAutoplay() { /* handled in prepare */ },
    titleNodes() { return Array.from(document.querySelectorAll('#video-title, h1.title')); },
    suppressHooks() {
        const shelves = document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer');
        shelves.forEach(el => el.remove());
    },
    expandChapters() {
        const btn = document.querySelector('yt-chip-cloud-chip-renderer[chip-id*="Chapters"]');
        if (btn) btn.click();
        const details = document.querySelector('#panels ytd-engagement-panel-section-list');
        if (details) details.style.display = 'block';
    },
    summarizeComments(level) {
        // Lightweight summarization: surface top-level condensed comments
        const comments = Array.from(document.querySelectorAll('#content-text')).slice(0, 20);
        comments.forEach(c => {
            const text = c.textContent || '';
            c.textContent = text.length > 140 ? text.slice(0, 120) + '…' : text;
        });
    },
    adjustPlaybackSpeed(base) {
        const video = document.querySelector('video');
        if (video) {
            // Nudge speed based on short pauses (buffering/hesitations)
            const paused = video.paused;
            video.playbackRate = paused ? Math.max(1.0, base - 0.2) : Math.min(2.5, base + 0.2);
        }
    }
};

// content/siteAdapters/genericAdapter.js
import { youtubeAdapter } from './youtubeAdapter.js';
import { docsAdapter } from './docsAdapter.js';
import { twitterAdapter } from './twitterAdapter.js';

export function detectAdapter(url) {
    const u = new URL(url);
    if (u.host.includes('youtube.com')) return youtubeAdapter;
    if (u.host.includes('twitter.com') || u.host.includes('x.com')) return twitterAdapter;
    return docsAdapter.match(u) ? docsAdapter : genericAdapter;
}

export const genericAdapter = {
    siteId: 'generic',
    capabilities: {
        chapters: false, comments: false, playback: false
    },
    prepare() { },
    reactiveInputs() { return Array.from(document.querySelectorAll('input, textarea, [contenteditable="true"]')); },
    truncateFeed(count) { },
    disableAutoplay() { },
    titleNodes() { return Array.from(document.querySelectorAll('h1,h2,h3,.title')); },
    suppressHooks() {
        const hooks = document.querySelectorAll('[data-recommendations], .infinite-scroll, [aria-live="polite"]');
        hooks.forEach(el => el.style.display = 'none');
    },
    focusMain(keep = 1) {
        const mains = document.querySelectorAll('main, [role="main"]');
        mains.forEach(m => m.style.filter = 'saturate(1.1)');
    },
    reorderSections(by) { },
    expandChapters() { },
    summarizeComments() { },
    adjustPlaybackSpeed() { },
    collapseThreads() { },
    prioritizeFacts() { }
};

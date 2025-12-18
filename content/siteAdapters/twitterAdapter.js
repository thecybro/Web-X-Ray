export const twitterAdapter = {
    siteId: 'twitter',
    capabilities: { chapters: false, comments: true, playback: false },
    prepare() { },
    reactiveInputs() { return Array.from(document.querySelectorAll('[data-testid="tweetTextarea_0"], [data-testid="replyTextarea"]')); },
    truncateFeed(count) {
        const tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        tweets.forEach((el, i) => { if (i >= count) el.style.display = 'none'; });
    },
    disableAutoplay() { },
    titleNodes() { return Array.from(document.querySelectorAll('article [dir="auto"]')); },
    suppressHooks() {
        const metrics = document.querySelectorAll('[data-testid="app-text-transition-container"], [role="group"]');
        metrics.forEach(el => el.style.visibility = 'hidden');
    },
    collapseThreads(mode) {
        if (mode !== 'argument_tree') return;
        const threads = document.querySelectorAll('article');
        threads.forEach(t => {
            const replies = t.querySelectorAll('[data-testid="reply"]');
            replies.forEach(r => r.style.display = 'none');
            const btn = t.querySelector('[role="group"]');
            if (btn) btn.insertAdjacentHTML('afterend', '<div style="opacity:.7">Argument tree view active</div>');
        });
    }, 
    prioritizeFacts() {
        const claims = document.querySelectorAll('article');
        claims.forEach(c => c.style.filter = 'contrast(1.05) saturate(0.95)');
    }
};

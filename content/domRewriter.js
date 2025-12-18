// content/domRewriter.js
import { simplifyText, neutralizeHeadline } from './utils/text.js';
import { applyDesaturation, injectDelay, tagClaims } from './utils/ui.js';

export class DomRewriter {
    constructor(policyGraph, adapter) {
        this.policyGraph = policyGraph;
        this.adapter = adapter;
        this.lastState = null;
    }

    apply(state) {
        // Avoid thrashing: only update when significant change
        if (this.lastState && this._similar(this.lastState, state)) return;
        this.lastState = state;

        console.log("Applying state:", state);

        const directives = this.policyGraph.evaluate(state);

        console.log("Applying directives:", directives);

        for (const d of directives) {
            switch (d.kind) {
                case 'desaturate':
                    applyDesaturation(document.documentElement, d.level);
                    break;

                case 'truncate_feed':
                    this.adapter.truncateFeed?.(d.count);
                    break;

                case 'disable_autoplay':
                    this.adapter.disableAutoplay?.();
                    break;

                case 'rewrite_titles':
                    this._rewriteTitles(d.tone, d.maxLen);
                    break;

                case 'inject_delay':
                    injectDelay(this.adapter.reactiveInputs?.(), d.ms);
                    break;

                case 'expand_chapters':
                    this.adapter.expandChapters?.();
                    break;

                case 'summarize_comments':
                    this.adapter.summarizeComments?.(d.level);
                    break;

                case 'speed_nudge':
                    this.adapter.adjustPlaybackSpeed?.(d.base);
                    break;

                case 'simplify_copy':
                    this._simplifyCopy(d.level);
                    break;

                case 'reduce_ui_density':
                    this._reduceUIDensity(d.level);
                    break;

                case 'suppress_hooks':
                    this.adapter.suppressHooks?.();
                    break;

                case 'focus_main':
                    this.adapter.focusMain?.(d.keep);
                    break;

                case 'tag_claims':
                    tagClaims(document.body, { certainty: d.certainty });
                    break;

                case 'collapse_threads':
                    this.adapter.collapseThreads?.(d.mode);
                    break;

                case 'prioritize_facts':
                    this.adapter.prioritizeFacts?.();
                    break;

                case 'delay_inputs':
                    injectDelay(this.adapter.reactiveInputs?.(), d.ms);
                    break;

                case 'compress_paragraphs':
                    this._compressParagraphs(d.level);
                    break;

                case 'reorder_sections':
                    this.adapter.reorderSections?.(d.by);
                    break;

                default:
                    break;
            }
        }
    }

    _rewriteTitles(tone, maxLen) {
        const nodes = this.adapter.titleNodes?.() || Array.from(document.querySelectorAll('h1,h2,h3,.title'));
        for (const n of nodes) {
            const text = n.textContent || '';
            const rewritten = neutralizeHeadline(text, maxLen);
            if (rewritten) n.textContent = rewritten;
        }
    }

    _simplifyCopy(level) {
        const paras = Array.from(document.querySelectorAll('p,li'));
        for (const p of paras) {
            const t = p.textContent || '';
            p.textContent = simplifyText(t, level);
        }
    }

    _compressParagraphs(level) {
        const paras = Array.from(document.querySelectorAll('p'));
        for (const p of paras) {
            p.style.lineHeight = `${Math.max(1.2, 1.6 - 0.1 * level)}`;
            p.style.fontSize = `${Math.max(13, 16 - level)}px`;
            p.style.maxHeight = `${Math.max(120, 280 - 20 * level)}px`;
            p.style.overflow = 'hidden';
        }
    }

    _reduceUIDensity(level) {
        const asideLike = Array.from(document.querySelectorAll('aside, [role="complementary"], .sidebar'));
        asideLike.forEach(el => el.style.display = level > 0.5 ? 'none' : 'block');
        const adLike = Array.from(document.querySelectorAll('[class*="ad"], [id*="ad"], .promo'));
        adLike.forEach(el => el.style.opacity = `${Math.max(0, 1 - level)}`);
    }

    _similar(a, b) {
        const keys = Object.keys(a);
        let diff = 0;
        for (const k of keys) diff += Math.abs(a[k] - b[k]);
        return diff < 0.05;
    }
}

// content/policyGraph.js
export class PolicyGraph {
    constructor(cfg, caps) {
        this.cfg = cfg;
        this.caps = caps;
    }

    // Returns actionable directives for current intent vector
    evaluate(state) {
        const intensity = this.cfg.intensity;

        const directives = [];

        // Doom scroll: desaturate, truncate feeds, disable autoplay
        if (state.doom_scroll > 0.25) {
            directives.push({ kind: 'desaturate', level: intensity });
            directives.push({ kind: 'truncate_feed', count: Math.round(8 - 6 * intensity) });
            directives.push({ kind: 'disable_autoplay' });
            directives.push({ kind: 'rewrite_titles', tone: 'neutral', maxLen: Math.round(50 - 30 * intensity) });
            if (this.cfg.frictionInjection) directives.push({ kind: 'inject_delay', ms: Math.round(800 * intensity) });
        }

        // Learning: expand chapters, summarize comments, adjust playback speed to comprehension pauses
        if (state.learning > 0.25) {
            directives.push({ kind: 'expand_chapters' });
            directives.push({ kind: 'summarize_comments', level: Math.round(3 * intensity) });
            directives.push({ kind: 'speed_nudge', base: 1.1 + 0.6 * intensity });
            directives.push({ kind: 'simplify_copy', level: Math.round(2 + 3 * intensity) });
        }

        // Deep work: reduce UI density, remove dopamine hooks, focus content
        if (state.deep_work > 0.25) {
            directives.push({ kind: 'reduce_ui_density', level: intensity });
            directives.push({ kind: 'suppress_hooks' });
            directives.push({ kind: 'focus_main', keep: 1 });
        }

        // Decision making: surface facts, collapse fluff, expose comparisons
        if (state.decision_making > 0.25) {
            directives.push({ kind: 'tag_claims', certainty: true });
            directives.push({ kind: 'collapse_threads', mode: 'argument_tree' });
            directives.push({ kind: 'prioritize_facts' });
        }

        // Avoidance: add gentle friction; delay reactive inputs
        if (state.avoidance > 0.25) {
            directives.push({ kind: 'delay_inputs', ms: Math.round(500 + 500 * intensity) });
        }

        // Skim explore: reorder info hierarchically, compress long blocks
        if (state.skim_explore > 0.25) {
            directives.push({ kind: 'compress_paragraphs', level: Math.round(2 + 3 * intensity) });
            directives.push({ kind: 'reorder_sections', by: 'salience' });
        }

        return directives;
    }
}

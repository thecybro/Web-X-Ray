// content/intentEngine.js
export class IntentEngine {
    constructor(context) {
        this.context = context;
        this.state = {
            deep_work: 0,
            skim_explore: 0,
            doom_scroll: 0,
            learning: 0,
            decision_making: 0,
            avoidance: 0
        };
        this.lastUpdate = performance.now();
        this.history = [];
    }

    ingest(signal) {
        const dt = Math.min((performance.now() - this.lastUpdate) / 1000, 2);
        this.lastUpdate = performance.now();

        // Normalize signals
        const { type, data } = signal;

        // Feature extraction
        let f = {
            scrollVel: 0,
            hesitations: 0,
            tabSwitch: 0,
            microMovements: 0,
            idle: 0,
            selection: 0,
            timeOfDay: this.context.timeOfDay,
            site: this.context.site
        };

        if (type === 'scroll') {
            f.scrollVel = Math.abs(data.deltaY) / (data.dt || 16);
        }
        if (type === 'mousemove') {
            f.microMovements = Math.min(1, Math.sqrt(data.dx * data.dx + data.dy * data.dy) / 50);
        }
        if (type === 'hesitation') {
            f.hesitations = 1;
        }
        if (type === 'idle') {
            f.idle = Math.min(1, data.seconds / 10);
        }
        if (type === 'select') {
            f.selection = Math.min(1, data.length / 120);
        }
        if (type === 'tab') {
            f.tabSwitch = 1;
        }

        // Intent scoring (heuristics baseline)
        const s = this.state;

        // Doom scroll: high scroll velocity, low selection, repetitive micro-movement
        s.doom_scroll = this._smooth(s.doom_scroll, this._clip(
            0.6 * this._norm(f.scrollVel, 0, 3) +
            0.2 * f.microMovements -
            0.3 * f.selection -
            0.2 * f.hesitations, 0, 1), dt);

        // Skim explore: moderate scroll, sporadic selects, tab switches
        s.skim_explore = this._smooth(s.skim_explore, this._clip(
            0.5 * this._norm(f.scrollVel, 0.5, 2) +
            0.3 * f.tabSwitch +
            0.2 * f.selection -
            0.2 * f.idle, 0, 1), dt);

        // Deep work: low tab switch, steady scroll, selections increasing
        s.deep_work = this._smooth(s.deep_work, this._clip(
            0.5 * (1 - f.tabSwitch) +
            0.3 * (1 - this._norm(f.scrollVel, 2, 4)) +
            0.3 * f.selection -
            0.2 * f.microMovements, 0, 1), dt);

        // Learning: selections, hesitations, low velocity; time-of-day slight boost mornings
        const todBoost = (f.timeOfDay >= 6 && f.timeOfDay <= 11) ? 0.1 : 0;
        s.learning = this._smooth(s.learning, this._clip(
            0.4 * f.selection +
            0.3 * f.hesitations +
            0.2 * (1 - this._norm(f.scrollVel, 1.5, 3)) +
            todBoost, 0, 1), dt);

        // Decision making: frequent selects, pauses, low micro-movement
        s.decision_making = this._smooth(s.decision_making, this._clip(
            0.4 * f.selection +
            0.3 * f.idle -
            0.2 * f.microMovements, 0, 1), dt);

        // Avoidance: idle + tab switches + high scroll vel spikes without selection
        s.avoidance = this._smooth(s.avoidance, this._clip(
            0.3 * f.idle +
            0.3 * f.tabSwitch +
            0.3 * this._norm(f.scrollVel, 2, 4) -
            0.3 * f.selection, 0, 1), dt);

        // Normalize vector softly
        this._softNormalize(s);

        // Persist short history
        this.history.push({ ts: Date.now(), s: { ...s } });
        if (this.history.length > 300) this.history.shift();

        return { ...s };
    }

    update(signal){
        console.log(`Intent Engine state:${this.state}`);
    }

    _smooth(prev, target, dt) {
        const alpha = Math.min(1, 0.15 * dt); // continuous transitions
        return prev + alpha * (target - prev);
    }

    _norm(x, mu, sigma) {
        return Math.max(0, Math.min(1, Math.abs((x - mu) / (sigma || 1))));
    }

    _clip(x, a, b) { return Math.min(b, Math.max(a, x)); }

    _softNormalize(s) {
        const sum = Object.values(s).reduce((acc, v) => acc + v, 0) || 1;
        for (const k of Object.keys(s)) s[k] = s[k] / sum;
    }
}

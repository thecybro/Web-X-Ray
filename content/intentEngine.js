export class IntentEngine {
    constructor({ intensity = 0.7 } = {}) {
        this.intensity = intensity;
        this.state = {
            scrollVelocity: 0,
            hesitation: 0,
            selection: 0
        };

        setInterval(() => this.decay(), 400);
    }

    update(type, value) {
        if (!(type in this.state)) return;

        this.state[type] = Math.min(
            1,
            this.state[type] + value * this.intensity
        );
    }
    
    decay() {
        for (const k in this.state) {
            this.state[k] *= 0.96;
            if (this.state[k] < 0.01) this.state[k] = 0;
        }
    }

    get dominantIntent() {
        return Object.entries(this.state)
            .sort((a, b) => b[1] - a[1])[0];
    }
}

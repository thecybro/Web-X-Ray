export class PolicyGraph {
    evaluate(intentState) {
        const policies = [];

        if (intentState.scrollVelocity > 0.4) {
            policies.push("slow-feed");
        }

        if (intentState.hesitation > 0.3) {
            policies.push("simplify-text");
        }

        if (intentState.selection > 0.15) {
            policies.push("highlight-context");
        }

        return policies;
    }
}



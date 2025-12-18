export class DomRewriter {
    constructor(policyGraph) {
        this.policyGraph = policyGraph;
        this.active = new Set();
    }

    apply(intentState) {
        const policies = this.policyGraph.evaluate(intentState);

        policies.forEach(p => {
            if (!this.active.has(p)) {
                this.activate(p);
                this.active.add(p);
            }
        });
    }

    activate(policy) {
        if (policy === "slow-feed") {
            document.body.style.scrollBehavior = "smooth";
            document.body.style.filter = "grayscale(40%)";
        }

        if (policy === "simplify-text") {
            document.querySelectorAll("p").forEach(p => {
                if (p.innerText.length > 400) {
                    p.style.maxHeight = "6em";
                    p.style.overflow = "hidden";
                }
            });
        }

        if (policy === "highlight-context") {
            document.body.style.outline = "3px solid #00ffcc";
            setTimeout(() => {
                document.body.style.outline = "";
            }, 600);
        }
    }
}

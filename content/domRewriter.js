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
            document.documentElement.style.filter = "grayscale(80%)";
            document.documentElement.style.transition = "filter 300ms";
        }

        if (policy === "simplify-text") {
            document.querySelectorAll("article, main, p").forEach(el => {
                if (el.innerText.length > 100) {
                    el.style.lineHeight = "2";
                    el.style.opacity = "0.2";
                }
            });
        }

        if (policy === "highlight-context") {
            document.body.style.boxShadow = "0 0 0 6px #c4fdf2ff inset";
            setTimeout(() => {
                document.body.style.boxShadow = "";
            }, 1000);
        }
    }
      
}

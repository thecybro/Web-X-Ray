# Web X-Ray

Web X-Ray is a Chrome extension that rewrites your web in real time based on your intent.  
It observes signals like scroll velocity, mouse hesitations, and text selections, then applies adaptive policies to reshape pages (simplify text, desaturate feeds, delay dopamine hooks, etc.).


## Repository Structure

Web X-Ray/
├─ manifest.json
├─ README.md
├─ assets/
│  ├─ icon16.png
│  ├─ icon48.png
│  └─ icon128.png
├─ background/
│  └─ serviceWorker.js
├─ content/
│  ├─ content.js
│  ├─ domRewriter.js
│  ├─ intentEngine.js
│  ├─ policyGraph.js
│  ├─ siteAdapters/
│  │  ├─ genericAdapter.js
│  │  ├─ youtubeAdapter.js
│  │  ├─ docsAdapter.js
│  │  └─ twitterAdapter.js
│  ├─ utils/
│  │  ├─ observe.js
│  │  ├─ text.js
│  │  └─ ui.js
│  └─ styles/
│     └─ reality.css
├─ settings/
│  ├─ options.html
│  ├─ options.js
│  └─ options.css
└─ storage/
   └─ store.js


## Installation

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer Mode** (from top right).
3. Click **Load unpacked**. (from top left).
4. Select the `Web X-Ray/` folder.
5. The extension will appear in your toolbar.


## Usage

- The extension runs automatically on all pages (`<all_urls>`).
- It silently observes your browsing behavior and rewrites the DOM based on intent.
- To configure:
  - Right‑click the extension icon → **Options**.
  - Adjust settings: Enabled, Intensity, Privacy Mode, Friction Injection.


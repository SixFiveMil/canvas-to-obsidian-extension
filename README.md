# Canvas to Obsidian Sync Browser Extension

[![CI](https://github.com/SixFiveMil/canvas-to-obsidian-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/SixFiveMil/canvas-to-obsidian-extension/actions/workflows/ci.yml)
[![Latest Release](https://img.shields.io/github/v/release/SixFiveMil/canvas-to-obsidian-extension?label=Extension%20Release&color=blue)](https://github.com/SixFiveMil/canvas-to-obsidian-extension/releases/latest)
[![Plugin Release](https://img.shields.io/github/v/release/SixFiveMil/obsidian-canvas-sync?label=Obsidian%20Plugin&color=purple)](https://github.com/SixFiveMil/obsidian-canvas-sync/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Browser extension companion for the [Obsidian Canvas Sync](https://github.com/SixFiveMil/obsidian-canvas-sync) plugin.

Extracts Canvas LMS courses, modules, assignments, submissions, rubrics, announcements, discussions, files, and calendar events directly from your authenticated browser session and securely sends them to Obsidian via a local HTTP bridge (`http://127.0.0.1:27125`).

---

## ✨ Features

- **Zero-Token Setup**: Uses your existing logged-in Canvas session cookies—no API token required (ideal for universities locking down API tokens).
- **Full Hierarchy Sync**: Course home, syllabus, modules, assignments, submissions & grades, rubric criteria, discussion topics, and course files.
- **Local-First & Private**: All data is transmitted directly over loopback (`127.0.0.1`) to Obsidian. Zero external telemetry or third-party relays.
- **Multi-Browser Support**: Chrome MV3 and Firefox MV2/MV3 compatible.

---

## 📦 Installation & Downloads

### Option 1: Official Store Releases
- **Google Chrome / Brave / Edge / Arc / Opera**: [Chrome Web Store](https://chromewebstore.google.com/detail/canvas-to-obsidian-sync/oiakmbihplldnhabhnihnekjddenbiom)
- **Mozilla Firefox**: [Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/canvas-to-obsidian-sync/)

### Option 2: Download Direct Release ZIPs (.crx / .xpi / .zip)
Download the standalone pre-packaged extension archives from the latest release:
👉 **[Latest Extension GitHub Release](https://github.com/SixFiveMil/canvas-to-obsidian-extension/releases/latest)**

* `canvas-to-obsidian-sync-chrome-<version>.zip` (Load unpacked in `chrome://extensions` with Developer mode on)
* `canvas-to-obsidian-sync-firefox-<version>.zip` (Load temporary add-on in `about:debugging#/runtime/this-firefox`)

---

## 🔌 Companion Obsidian Plugin

This extension requires the **Canvas Sync Bridge** plugin installed and running in Obsidian:

* **Repository**: [SixFiveMil/obsidian-canvas-sync](https://github.com/SixFiveMil/obsidian-canvas-sync)
* **Latest Plugin Release (`main.js`, `manifest.json`, `styles.css`)**: [Obsidian Plugin Latest Release](https://github.com/SixFiveMil/obsidian-canvas-sync/releases/latest)
* **Obsidian Community Directory**: [Canvas Sync Bridge on Community Plugins](https://community.obsidian.md/plugins/canvas-sync-bridge)

---

## 🛠️ Development & Building from Source

```bash
# Clone extension repository
git clone https://github.com/SixFiveMil/canvas-to-obsidian-extension.git
cd canvas-to-obsidian-extension

# Install dependencies
npm install

# Run unit and contract tests
npm test

# Type check
npm run typecheck

# Build Chrome and Firefox distributions
npm run build

# Package zip archives for release (outputs to release/)
npm run package
```

---

## 🔒 Security & Privacy

- All extracted course content is transferred strictly over `http://127.0.0.1:27125/canvas-sync`.
- Origin verification and CORS protection ensure local bridge security.
- Read our full [Privacy Policy](PRIVACY.md) and [Security Policy](SECURITY.md).

---

## 📄 License

MIT © [Joshua A. Wortz](https://github.com/SixFiveMil)

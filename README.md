# Canvas to Obsidian Sync Browser Extension

[![CI](https://github.com/SixFiveMil/canvas-to-obsidian-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/SixFiveMil/canvas-to-obsidian-extension/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Browser extension companion for the [Obsidian Canvas Sync Bridge](https://github.com/SixFiveMil/obsidian-canvas-sync) plugin.

Extracts Canvas LMS courses, modules, assignments, submissions, rubrics, announcements, discussions, files, and calendar events directly from your authenticated browser session and securely sends them to Obsidian via a local HTTP bridge (`http://127.0.0.1:27125`).

---

## Features

- **Zero-Token Setup**: Uses your existing logged-in Canvas session cookies—no API token required.
- **Full Hierarchy Sync**: Course home, syllabus, modules, assignments, submissions & grades, rubric criteria, discussion topics, and course files.
- **Local-First & Private**: All data is transmitted directly over loopback (`127.0.0.1`) to Obsidian. Zero external telemetry or third-party servers.
- **Multi-Browser Support**: Chrome MV3 and Firefox MV2/MV3 compatible.

---

## Installation

### Chrome / Chromium
Install from the [Chrome Web Store](https://chromewebstore.google.com/detail/canvas-to-obsidian-sync/YOUR_EXTENSION_ID) (or load unpacked from `dist/chrome`).

### Firefox
Install from [Firefox Browser Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/canvas-to-obsidian-sync/) (or load temporary add-on from `dist/firefox`).

---

## Development

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Type check
npm run typecheck

# Build Chrome and Firefox distributions
npm run build

# Package zip archives for release
npm run package
```

---

## Companion Plugin

This extension requires the **Canvas Sync Bridge** plugin installed and enabled in your Obsidian vault.
- Repository: [SixFiveMil/obsidian-canvas-sync](https://github.com/SixFiveMil/obsidian-canvas-sync)
- Obsidian Community Plugins: `Canvas Sync Bridge`

---

## License

MIT © [Joshua A. Wortz](https://github.com/SixFiveMil)

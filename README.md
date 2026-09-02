# TWP Script Deployer

A Chrome extension (Manifest V3) built with React, TypeScript, and Vite.

## Development

```sh
npm run dev
```

Then in Chrome: go to `chrome://extensions`, enable **Developer mode**, click
**Load unpacked**, and select the `dist/` folder that Vite generates. Vite +
`@crxjs/vite-plugin` will hot-reload the extension as you edit files.

## Production build

```sh
npm run build
```

Outputs a load-able extension to `dist/`.

## Project structure

- `manifest.json` — the extension's manifest (MV3). Declares the popup,
  background service worker, content script, and permissions.
- `vite.config.ts` — build config. The `@crxjs/vite-plugin` reads
  `manifest.json` and wires up the special build steps a Chrome extension
  needs (separate bundles per entry point, HMR for the popup, etc.).
- `src/popup/` — the React app shown when you click the extension's toolbar
  icon (`index.html` → `main.tsx` → `App.tsx`).
- `src/background/index.ts` — the background **service worker**. Runs
  persistently (no DOM), good for handling events/messages/alarms.
- `src/content/index.ts` — a **content script** injected into web pages that
  match the `matches` pattern in `manifest.json`. Runs alongside the page's
  own scripts but in an isolated JS context.

## Key concepts to learn from this boilerplate

- **`chrome.storage.local`** (used in `App.tsx`) persists data across popup
  opens/closes — popups fully unmount when closed, so `useState` alone won't
  survive.
- **`chrome.tabs.query`** lets the popup ask which tab is currently active.
- **`chrome.runtime.sendMessage` / `onMessage`** is how the popup, background,
  and content scripts talk to each other, since they run in separate JS
  contexts.
- **Permissions** in `manifest.json` (`storage`, `activeTab`) must list every
  Chrome API surface you use, or calls will fail silently/throw.

# TWP Script Deployer

A Chrome extension (Manifest V3) that deploys and manages custom scripts on
TimeWorksPlus (TWP) pages. Built with React, TypeScript, and Vite.

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
  background service worker, content script, and permissions. `matches` is
  scoped to `https://clock.payrollservers.us/*`, the TimeWorksPlus domain.
- `vite.config.ts` — build config. The `@crxjs/vite-plugin` reads
  `manifest.json` and wires up the special build steps a Chrome extension
  needs (separate bundles per entry point, HMR for the popup, etc.).
- `src/scripts/` — the script registry. Each script implements the
  `TwpScript` interface (`src/scripts/types.ts`) and is registered in
  `src/scripts/index.ts`. Add a new file here + register it to deploy a new
  script.
- `src/popup/` — the React app shown when you click the extension's toolbar
  icon (`index.html` → `main.tsx` → `App.tsx`). Lists every registered script
  with a checkbox to enable/disable it (persisted to `chrome.storage.local`).
- `src/background/index.ts` — the background **service worker**. Runs
  persistently (no DOM), good for handling events/messages/alarms.
- `src/content/index.ts` — a **content script** injected into TWP pages. On
  load it reads the enabled/disabled state from `chrome.storage.local` and
  runs every enabled script whose `urlPattern` (if any) matches the page.

## Adding a new script

1. Copy `src/scripts/example-script.ts`, give it a unique `id`.
2. Implement `run()` with the DOM automation/logic to deploy.
3. Register it in the `scripts` array in `src/scripts/index.ts`.
4. Reload the extension — it now shows up in the popup, enabled by default.

## Key concepts to learn from this boilerplate

- **`chrome.storage.local`** persists which scripts are enabled across popup
  opens/closes — popups fully unmount when closed, so `useState` alone won't
  survive.
- **`chrome.tabs.query`** lets the popup ask which tab is currently active.
- **`chrome.runtime.sendMessage` / `onMessage`** is how the popup, background,
  and content scripts talk to each other, since they run in separate JS
  contexts.
- **Permissions** in `manifest.json` (`storage`, `activeTab`) must list every
  Chrome API surface you use, or calls will fail silently/throw.


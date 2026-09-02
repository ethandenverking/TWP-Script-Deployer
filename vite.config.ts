import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' with { type: 'json' }

// crx() takes our manifest.json and wires up MV3-specific build steps
// (background service worker, content scripts, HMR for the popup, etc.)
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    // required so the crx plugin's HMR websocket can reach the extension
    port: 5173,
    strictPort: true,
    hmr: { port: 5173 },
  },
})

import type { TwpScript } from './types'

// Template for a real script: copy this file, give it a unique id, and
// register it in `src/scripts/index.ts`.
export const exampleScript: TwpScript = {
  id: 'example-script',
  name: 'Example Script',
  description: 'Logs a message to the console. Replace with real TWP automation.',
  run: () => {
    console.log('[TWP Script Deployer] example-script is running on', window.location.href)
  },
}

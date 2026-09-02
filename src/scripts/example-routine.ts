import type { TwpScript } from './types'

// Template for a real routine: copy this file, give it a unique id, and
// register it in `src/scripts/index.ts`.
export const exampleRoutine: TwpScript = {
  id: 'example-routine',
  name: 'Example Routine',
  description: 'Logs a message to the console. Replace with real TWP automation.',
  run: () => {
    console.log('[TWP Script Deployer] example-routine is running on', window.location.href)
  },
}

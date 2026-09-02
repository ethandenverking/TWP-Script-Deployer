// A named, reusable snippet of TWP's proprietary scripting language. `content`
// is keyed by the `id` of the page it belongs to (see twp-pages.ts) since the
// same template can supply different text per page slot. This is NOT
// JavaScript — it's the exact text that gets pasted into TWP's own scripting
// textarea.
export interface TwpScriptTemplate {
  id: string
  label: string
  content: Record<string, string>
}

// Registry of every predefined script template offered when a user creates
// or edits a saved script. Add new templates here to make them selectable
// in the popup.
export const twpScriptTemplates: TwpScriptTemplate[] = [
  {
    id: 'test-script-1',
    label: 'Test Script 1',
    content: {
      otthreshold: `ot1threshold = 40;`,
      addentry: ``,
    },
  },
  {
    id: 'test-script-2',
    label: 'Test Script 2',
    content: {
      otthreshold: ``,
      addentry: ``,
    },
  },
]

// Shared chrome.storage.local key + type for tracking which scripts are
// enabled, so the content script and popup agree on the shape.
export const ENABLED_SCRIPTS_KEY = 'enabledScripts'

export type EnabledScriptsMap = Record<string, boolean>

// Shared chrome.storage.local key + type for the user's saved TWP DSL
// scripts (proprietary-language snippets, not JS), each targeting a slot
// from twp-pages.ts.
export const SAVED_SCRIPTS_KEY = 'savedScripts'

export interface SavedTwpScript {
  id: string
  name: string
  pageId: string
  content: string
}

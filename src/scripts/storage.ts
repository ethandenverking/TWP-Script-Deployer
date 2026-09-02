// Shared chrome.storage.local key + type for tracking which scripts are
// enabled, so the content script and popup agree on the shape.
export const ENABLED_SCRIPTS_KEY = 'enabledScripts'

export type EnabledScriptsMap = Record<string, boolean>

// Shared chrome.storage.local key + type for the user's saved script
// deployments. Each references a template from twp-script-content.ts, which
// auto-applies its content to every page id its content record includes.
export const SAVED_SCRIPTS_KEY = 'savedScripts'

export interface SavedTwpScript {
  id: string
  templateId: string
}

// Shared chrome.storage.local key for user-created templates, kept separate
// from the built-in ones defined in twp-script-content.ts.
export const CUSTOM_TEMPLATES_KEY = 'customTemplates'

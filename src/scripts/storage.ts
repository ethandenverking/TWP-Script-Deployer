// Shared chrome.storage.local key + type for tracking which scripts are
// enabled, so the content script and popup agree on the shape.
export const ENABLED_SCRIPTS_KEY = 'enabledScripts'

export type EnabledScriptsMap = Record<string, boolean>

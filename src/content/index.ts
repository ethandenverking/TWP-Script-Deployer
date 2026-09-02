// Content scripts are injected into matching web pages (see manifest.json
// "content_scripts"). They share the page's DOM but run in an isolated JS
// world, so they can't directly access the page's own scripts/variables.
import { scripts } from '../scripts'
import { ENABLED_SCRIPTS_KEY, type EnabledScriptsMap } from '../scripts/storage'

console.log('TWP Script Deployer content script loaded on', window.location.href)

chrome.storage.local.get([ENABLED_SCRIPTS_KEY], (result: { [ENABLED_SCRIPTS_KEY]?: EnabledScriptsMap }) => {
  const enabled = result[ENABLED_SCRIPTS_KEY] ?? {}

  for (const script of scripts) {
    // Default to enabled unless the user has explicitly turned it off.
    if (enabled[script.id] === false) continue
    if (script.urlPattern && !script.urlPattern.test(window.location.href)) continue

    try {
      script.run()
    } catch (error) {
      console.error(`[TWP Script Deployer] "${script.name}" threw an error:`, error)
    }
  }
})

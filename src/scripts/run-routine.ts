// Drives a template across every TWP page it has content for: opens the
// page in a background tab, prepends the template's content to that page's
// scripting textarea, clicks its save button, then closes the tab. Runs
// live against TWP — nothing here touches chrome.storage.

import { twpScriptPages } from './twp-pages'
import type { TwpScriptTemplate } from './twp-script-content'

// Injected into the page via chrome.scripting.executeScript, so it must be
// self-contained (no closures over outer variables).
function prependContentAndSave(content: string, textareaSelector?: string, saveButtonSelector?: string) {
  const textarea = (
    textareaSelector ? document.querySelector(textareaSelector) : document.querySelector('textarea')
  ) as HTMLTextAreaElement | null
  if (!textarea) throw new Error('Could not find the scripting textarea on this page')

  textarea.value = `${content}\n${textarea.value}`
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
  textarea.dispatchEvent(new Event('change', { bubbles: true }))

  const saveButton = saveButtonSelector
    ? document.querySelector<HTMLElement>(saveButtonSelector)
    : Array.from(document.querySelectorAll<HTMLElement>('button, input[type="submit"], input[type="button"]')).find(
        (el) => (el.textContent || (el as HTMLInputElement).value || '').trim().toLowerCase().includes('save'),
      )
  if (!saveButton) throw new Error('Could not find the save button on this page')

  saveButton.click()
}

// Resolves once the tab reaches "complete", or after timeoutMs — whichever
// comes first, so a page that saves via AJAX (no full reload) can't hang us.
function waitForTabComplete(tabId: number, timeoutMs = 8000): Promise<void> {
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      chrome.tabs.onUpdated.removeListener(listener)
      resolve()
    }
    const listener = (updatedTabId: number, info: chrome.tabs.TabChangeInfo) => {
      if (updatedTabId === tabId && info.status === 'complete') finish()
    }
    chrome.tabs.onUpdated.addListener(listener)
    setTimeout(finish, timeoutMs)
  })
}

export interface RunRoutineProgressEvent {
  pageId: string
  status: 'writing' | 'saved' | 'error'
  error?: string
}

export async function runRoutine(
  template: TwpScriptTemplate,
  onProgress?: (event: RunRoutineProgressEvent) => void,
  shouldAbort?: () => boolean,
): Promise<void> {
  for (const page of Object.values(twpScriptPages)) {
    if (shouldAbort?.()) break

    const content = template.content[page.id]
    if (!content) continue

    const tab = await chrome.tabs.create({ url: page.url, active: false })
    if (tab.id === undefined) continue

    onProgress?.({ pageId: page.id, status: 'writing' })
    try {
      await waitForTabComplete(tab.id)
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: prependContentAndSave,
        args: [content, page.textareaSelector, page.saveButtonSelector],
      })
      // Give TWP's save postback a chance to finish before we close the tab.
      await waitForTabComplete(tab.id)
      onProgress?.({ pageId: page.id, status: 'saved' })
    } catch (error) {
      // Without a progress listener, preserve the original throw-and-stop behavior.
      if (!onProgress) throw error
      onProgress({ pageId: page.id, status: 'error', error: error instanceof Error ? error.message : String(error) })
    } finally {
      await chrome.tabs.remove(tab.id)
    }
  }
}

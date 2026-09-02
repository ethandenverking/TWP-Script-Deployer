// The background service worker runs in its own context (no DOM access).
// It's the place for long-lived logic: listening for browser events,
// handling messages between popup/content scripts, alarms, etc.

chrome.runtime.onInstalled.addListener(() => {
  console.log('TWP Script Deployer installed')
})

// Example: listen for messages sent from the content script or popup via
// chrome.runtime.sendMessage(...)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ type: 'PONG' })
  }
  // returning true keeps the message channel open for an async sendResponse
  return true
})

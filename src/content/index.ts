// Content scripts are injected into matching web pages (see manifest.json
// "content_scripts"). They share the page's DOM but run in an isolated JS
// world, so they can't directly access the page's own scripts/variables.

console.log('TWP Script Deployer content script loaded on', window.location.href)

// Example: ask the background service worker something
chrome.runtime.sendMessage({ type: 'PING' }, (response) => {
  console.log('Background responded:', response)
})

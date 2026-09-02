import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [url, setUrl] = useState('')

  // Example: read persisted state from chrome.storage when the popup opens
  useEffect(() => {
    chrome.storage.local.get(['count'], (result: { count?: number }) => {
      setCount(result.count ?? 0)
    })

    // Example: talk to the active tab to learn about the page the popup is open on
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrl(tabs[0]?.url ?? 'unknown')
    })
  }, [])

  const increment = () => {
    const next = count + 1
    setCount(next)
    // Persist so the value survives the popup closing (popups unmount on close!)
    chrome.storage.local.set({ count: next })
  }

  return (
    <div className="app">
      <h1>TWP Script Deployer</h1>
      <p className="url">Active tab: {url}</p>
      <button onClick={increment}>Count is {count}</button>
      <p className="hint">
        Edit <code>src/popup/App.tsx</code> and reload the extension to see changes.
      </p>
    </div>
  )
}

export default App

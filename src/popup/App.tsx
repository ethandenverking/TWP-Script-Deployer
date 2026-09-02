import { useEffect, useState } from 'react'
import './App.css'
import { scripts } from '../scripts'
import { ENABLED_SCRIPTS_KEY, type EnabledScriptsMap } from '../scripts/storage'
import ScriptLibrary from './ScriptLibrary'

function App() {
  const [enabled, setEnabled] = useState<EnabledScriptsMap>({})
  const [url, setUrl] = useState('')

  useEffect(() => {
    chrome.storage.local.get([ENABLED_SCRIPTS_KEY], (result: { [ENABLED_SCRIPTS_KEY]?: EnabledScriptsMap }) => {
      setEnabled(result[ENABLED_SCRIPTS_KEY] ?? {})
    })

    // Example: talk to the active tab to learn about the page the popup is open on
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrl(tabs[0]?.url ?? 'unknown')
    })
  }, [])

  const toggleScript = (id: string) => {
    // Scripts run by default, so absence of a key means "on".
    const isCurrentlyEnabled = enabled[id] !== false
    const next = { ...enabled, [id]: !isCurrentlyEnabled }
    setEnabled(next)
    chrome.storage.local.set({ [ENABLED_SCRIPTS_KEY]: next })
  }

  return (
    <div className="app">
      <h1>TWP Script Deployer</h1>
      <p className="url">Active tab: {url}</p>
      <ul className="script-list">
        {scripts.map((script) => {
          const isEnabled = enabled[script.id] !== false
          return (
            <li key={script.id} className="script-item">
              <label>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleScript(script.id)}
                />
                <span className="script-name">{script.name}</span>
              </label>
              <p className="script-description">{script.description}</p>
            </li>
          )
        })}
      </ul>
      <ScriptLibrary />
    </div>
  )
}

export default App

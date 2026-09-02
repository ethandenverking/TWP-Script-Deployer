import { useEffect, useState } from 'react'
import { twpScriptPages } from '../scripts/twp-pages'
import { SAVED_SCRIPTS_KEY, type SavedTwpScript } from '../scripts/storage'

const pageOptions = Object.values(twpScriptPages)

const emptyForm = { name: '', pageId: pageOptions[0]?.id ?? '', content: '' }

function ScriptLibrary() {
  const [savedScripts, setSavedScripts] = useState<SavedTwpScript[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    chrome.storage.local.get([SAVED_SCRIPTS_KEY], (result: { [SAVED_SCRIPTS_KEY]?: SavedTwpScript[] }) => {
      setSavedScripts(result[SAVED_SCRIPTS_KEY] ?? [])
    })
  }, [])

  const persist = (next: SavedTwpScript[]) => {
    setSavedScripts(next)
    chrome.storage.local.set({ [SAVED_SCRIPTS_KEY]: next })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const startEdit = (script: SavedTwpScript) => {
    setEditingId(script.id)
    setForm({ name: script.name, pageId: script.pageId, content: script.content })
  }

  const deleteScript = (id: string) => {
    persist(savedScripts.filter((s) => s.id !== id))
    if (editingId === id) resetForm()
  }

  const submitForm = () => {
    if (!form.name.trim() || !form.pageId) return

    if (editingId) {
      persist(savedScripts.map((s) => (s.id === editingId ? { ...s, ...form } : s)))
    } else {
      persist([...savedScripts, { id: crypto.randomUUID(), ...form }])
    }
    resetForm()
  }

  return (
    <div className="script-library">
      <h2>Script Library</h2>
      <ul className="script-list">
        {savedScripts.map((script) => {
          const page = twpScriptPages[script.pageId]
          return (
            <li key={script.id} className="script-item">
              <span className="script-name">{script.name}</span>
              <p className="script-description">{page?.label ?? script.pageId}</p>
              <div className="script-actions">
                <button onClick={() => startEdit(script)}>Edit</button>
                <button onClick={() => deleteScript(script.id)}>Delete</button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="script-form">
        <input
          type="text"
          placeholder="Script name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select value={form.pageId} onChange={(e) => setForm({ ...form, pageId: e.target.value })}>
          {pageOptions.map((page) => (
            <option key={page.id} value={page.id}>
              {page.label || page.id}
            </option>
          ))}
        </select>
        <textarea
          placeholder="TWP script content"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div className="script-actions">
          <button onClick={submitForm}>{editingId ? 'Save changes' : 'Add script'}</button>
          {editingId && <button onClick={resetForm}>Cancel</button>}
        </div>
      </div>
    </div>
  )
}

export default ScriptLibrary

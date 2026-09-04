import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { twpScriptTemplates, type TwpScriptTemplate } from '../scripts/twp-script-content'
import { CUSTOM_TEMPLATES_KEY } from '../scripts/storage'
import { twpScriptPages } from '../scripts/twp-pages'
import { runRoutine, type RunRoutineProgressEvent } from '../scripts/run-routine'
import ScriptLibrary from './ScriptLibrary'
import TemplateEditor from './TemplateEditor'
import DeploySheet from './DeploySheet'

type View = 'library' | 'editor' | 'new'

export interface DeployRow {
  pageId: string
  label: string
  lines: number
  status: 'pending' | 'writing' | 'saved' | 'error'
  error?: string
}

interface SheetState {
  open: boolean
  phase: 'confirm' | 'running' | 'done'
  rows: DeployRow[]
}

const pages = Object.values(twpScriptPages)

const closedSheet: SheetState = { open: false, phase: 'confirm', rows: [] }

function App() {
  const [customTemplates, setCustomTemplates] = useState<TwpScriptTemplate[]>([])
  const [view, setView] = useState<View>('library')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [activeTabHost, setActiveTabHost] = useState('')
  const [sheet, setSheet] = useState<SheetState>(closedSheet)
  const abortRef = useRef(false)

  useEffect(() => {
    chrome.storage.local.get(
      [CUSTOM_TEMPLATES_KEY],
      (result: { [CUSTOM_TEMPLATES_KEY]?: TwpScriptTemplate[] } | undefined) => {
        setCustomTemplates(result?.[CUSTOM_TEMPLATES_KEY] ?? [])
      },
    )
  }, [])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const rawUrl = tabs[0]?.url
      if (!rawUrl) return
      try {
        setActiveTabHost(new URL(rawUrl).host)
      } catch {
        setActiveTabHost('')
      }
    })
  }, [])

  // Built-in templates first (an edited built-in is overridden in place by a
  // customTemplates entry sharing its id), then any newly-created templates.
  const templates = useMemo(() => {
    const customById = new Map(customTemplates.map((t) => [t.id, t]))
    const builtinIds = new Set(twpScriptTemplates.map((t) => t.id))
    const builtins = twpScriptTemplates.map((t) => customById.get(t.id) ?? t)
    const extras = customTemplates.filter((t) => !builtinIds.has(t.id))
    return [...builtins, ...extras]
  }, [customTemplates])

  useEffect(() => {
    if (!selectedTemplateId && templates.length > 0) {
      setSelectedTemplateId(templates[0].id)
    }
  }, [templates, selectedTemplateId])

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null

  const handleSaveEdit = useCallback(
    (templateId: string, content: Record<string, string>) => {
      const label = templates.find((t) => t.id === templateId)?.label ?? templateId
      setCustomTemplates((prev) => {
        const next = [...prev.filter((t) => t.id !== templateId), { id: templateId, label, content }]
        chrome.storage.local.set({ [CUSTOM_TEMPLATES_KEY]: next })
        return next
      })
      setView('library')
    },
    [templates],
  )

  const handleSaveNew = useCallback((template: TwpScriptTemplate) => {
    setCustomTemplates((prev) => {
      const next = [...prev, template]
      chrome.storage.local.set({ [CUSTOM_TEMPLATES_KEY]: next })
      return next
    })
    setSelectedTemplateId(template.id)
    setView('library')
  }, [])

  const backToLibrary = useCallback(() => setView('library'), [])

  const openConfirmSheet = useCallback(() => {
    if (!selectedTemplate) return
    const rows: DeployRow[] = pages
      .filter((page) => Boolean(selectedTemplate.content[page.id]))
      .map((page) => ({
        pageId: page.id,
        label: page.label,
        lines: selectedTemplate.content[page.id].split('\n').length,
        status: 'pending',
      }))
    abortRef.current = false
    setSheet({ open: true, phase: 'confirm', rows })
  }, [selectedTemplate])

  const closeSheet = useCallback(() => setSheet(closedSheet), [])

  const startDeploy = useCallback(() => {
    if (!selectedTemplate) return
    setSheet((prev) => ({ ...prev, phase: 'running' }))

    const onProgress = (event: RunRoutineProgressEvent) => {
      setSheet((prev) => ({
        ...prev,
        rows: prev.rows.map((row) =>
          row.pageId === event.pageId ? { ...row, status: event.status, error: event.error } : row,
        ),
      }))
    }

    runRoutine(selectedTemplate, onProgress, () => abortRef.current).finally(() => {
      setSheet((prev) => ({ ...prev, phase: 'done' }))
    })
  }, [selectedTemplate])

  const handleSheetPrimary = useCallback(() => {
    if (sheet.phase === 'confirm') startDeploy()
    else if (sheet.phase === 'running') abortRef.current = true
    else closeSheet()
  }, [sheet.phase, startDeploy, closeSheet])

  return (
    <div className="app">
      {view === 'library' && (
        <ScriptLibrary
          activeTabHost={activeTabHost}
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          onSelect={setSelectedTemplateId}
          onRunRoutine={openConfirmSheet}
          onEdit={() => setView('editor')}
          onNew={() => setView('new')}
        />
      )}
      {view === 'editor' && selectedTemplate && (
        <TemplateEditor
          key={selectedTemplate.id}
          mode="edit"
          template={selectedTemplate}
          onSaveEdit={handleSaveEdit}
          onSaveNew={handleSaveNew}
          onBack={backToLibrary}
        />
      )}
      {view === 'new' && (
        <TemplateEditor mode="new" onSaveEdit={handleSaveEdit} onSaveNew={handleSaveNew} onBack={backToLibrary} />
      )}
      <DeploySheet
        open={sheet.open}
        phase={sheet.phase}
        templateLabel={selectedTemplate?.label ?? ''}
        rows={sheet.rows}
        onPrimary={handleSheetPrimary}
        onDismiss={closeSheet}
      />
    </div>
  )
}

export default App

import { useRef, useState, type KeyboardEvent } from 'react'
import { twpScriptPages, type TwpScriptPage } from '../scripts/twp-pages'
import type { TwpScriptTemplate } from '../scripts/twp-script-content'
import { countNonBlankLines, filledPageCountFromContent, reindentByBraces, stripScriptSuffix } from './format'

const pages = Object.values(twpScriptPages)

interface TemplateEditorProps {
  mode: 'edit' | 'new'
  template?: TwpScriptTemplate
  onSaveEdit: (templateId: string, content: Record<string, string>) => void
  onSaveNew: (template: TwpScriptTemplate) => void
  onBack: () => void
}

function TemplateEditor({ mode, template, onSaveEdit, onSaveNew, onBack }: TemplateEditorProps) {
  const [content, setContent] = useState<Record<string, string>>(() => ({ ...(template?.content ?? {}) }))
  const [activeSlotId, setActiveSlotId] = useState(pages[0]?.id ?? '')
  const [name, setName] = useState('')
  const railRefs = useRef<(HTMLDivElement | null)[]>([])

  const activePage = pages.find((p) => p.id === activeSlotId) ?? pages[0]
  const activeBody = content[activePage.id] ?? ''
  const filledCount = filledPageCountFromContent(content)

  const setBody = (value: string) => setContent((prev) => ({ ...prev, [activePage.id]: value }))

  const focusRail = (index: number) => {
    setActiveSlotId(pages[index].id)
    railRefs.current[index]?.focus()
  }

  const handleRailKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveSlotId(pages[index].id)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusRail(Math.min(index + 1, pages.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusRail(Math.max(index - 1, 0))
    }
  }

  const renderRailRow = (page: TwpScriptPage, index: number) => {
    const isActive = page.id === activeSlotId
    const filled = Boolean(content[page.id])
    return (
      <div
        key={page.id}
        ref={(el) => {
          railRefs.current[index] = el
        }}
        role="button"
        tabIndex={0}
        onClick={() => setActiveSlotId(page.id)}
        onKeyDown={(e) => handleRailKeyDown(e, index)}
        style={{
          display: 'grid',
          gridTemplateColumns: '14px 1fr',
          gap: 7,
          alignItems: 'baseline',
          padding: '7px 10px',
          cursor: 'pointer',
          background: isActive ? '#e9f8ff' : 'transparent',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontVariantNumeric: 'tabular-nums',
            color: filled ? '#0088b0' : 'rgba(32,30,29,.35)',
          }}
        >
          {filled ? '●' : String(index + 1).padStart(2, '0')}
        </span>
        <span
          style={{
            fontSize: 12.5,
            lineHeight: 1.25,
            letterSpacing: '-.005em',
            overflowWrap: 'anywhere',
            color: isActive ? '#201e1d' : 'rgba(32,30,29,.72)',
          }}
        >
          {stripScriptSuffix(page.label)}
        </span>
      </div>
    )
  }

  if (mode === 'edit' && template) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 12px' }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ minHeight: 28, padding: '0 6px', fontSize: 16 }} title="Back to library">
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.55)' }}>
              Template
            </div>
            <div style={{ fontSize: 17, letterSpacing: '-.01em' }}>{template.label}</div>
          </div>
          <button className="btn btn-primary" onClick={() => onSaveEdit(template.id, content)} style={{ minHeight: 32 }}>
            Save
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderTop: '1px solid rgba(32,30,29,.14)', flex: 1, minHeight: 0 }}>
          <div style={{ borderRight: '1px solid rgba(32,30,29,.14)', overflowY: 'auto', overflowX: 'hidden', padding: '6px 0' }}>
            {pages.map(renderRailRow)}
          </div>
          <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
            <div style={{ fontSize: 14, letterSpacing: '-.01em' }}>{activePage.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(32,30,29,.5)', fontStyle: 'italic' }}>Prepended to the page's script box</div>
            <textarea
              className="input"
              spellCheck={false}
              style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, flex: 1, minHeight: 0, lineHeight: 1.6, background: '#f8f4f4' }}
              value={activeBody}
              onChange={(e) => setBody(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(32,30,29,.45)' }}>
              <span>{countNonBlankLines(activeBody)} lines</span>
              <span>{filledCount} of 10 filled</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(32,30,29,.14)', padding: '10px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.5)' }}>
            Utilities
          </span>
          <button
            className="btn btn-ghost"
            onClick={() => setBody(reindentByBraces(activeBody))}
            style={{ minHeight: 26, padding: '0 8px', fontSize: 11 }}
            title="Re-indent based on curly/paren/square brackets"
          >
            Format
          </button>
        </div>
      </div>
    )
  }

  const saveDisabled = !name.trim() || filledCount === 0
  const gatingHint = !name.trim()
    ? 'Name it to save'
    : filledCount === 0
      ? 'Fill at least one script page'
      : `Ready to save · deploys to ${filledCount} ${filledCount === 1 ? 'page' : 'pages'}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 10px' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ minHeight: 28, padding: '0 6px', fontSize: 16 }} title="Back to library">
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.55)' }}>
            New template
          </div>
          <h3 style={{ margin: '1px 0 0', fontSize: 20, letterSpacing: '-.02em' }}>From scratch</h3>
        </div>
        <button
          className="btn btn-primary"
          disabled={saveDisabled}
          onClick={() => onSaveNew({ id: crypto.randomUUID(), label: name.trim(), content })}
          style={{ minHeight: 32 }}
        >
          Save
        </button>
      </div>
      <div style={{ padding: '0 18px 12px' }}>
        <input
          className="input"
          placeholder="Template name — e.g. Client 4412 Meal Rules"
          style={{ fontSize: 16, letterSpacing: '-.01em', background: '#f8f4f4', width: '100%' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderTop: '1px solid rgba(32,30,29,.14)', flex: 1, minHeight: 0 }}>
        <div style={{ borderRight: '1px solid rgba(32,30,29,.14)', overflowY: 'auto', overflowX: 'hidden', padding: '6px 0' }}>
          <div style={{ padding: '2px 10px 6px', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.5)' }}>
            Script pages
          </div>
          {pages.map(renderRailRow)}
        </div>
        <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div style={{ fontSize: 14, letterSpacing: '-.01em' }}>{activePage.label}</div>
          <div style={{ fontSize: 11, color: 'rgba(32,30,29,.5)', fontStyle: 'italic' }}>Leave blank to skip this page</div>
          <textarea
            className="input"
            spellCheck={false}
            placeholder="Paste TWP script here"
            style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, flex: 1, minHeight: 0, lineHeight: 1.6, background: '#f8f4f4' }}
            value={activeBody}
            onChange={(e) => setBody(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(32,30,29,.45)' }}>
            <span>{gatingHint}</span>
            <span>{filledCount} of 10</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(32,30,29,.14)', padding: '10px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.5)' }}>
          Utilities
        </span>
        <button
          className="btn btn-ghost"
          onClick={() => setBody(reindentByBraces(activeBody))}
          style={{ minHeight: 26, padding: '0 8px', fontSize: 11 }}
          title="Re-indent based on curly/paren/square brackets"
        >
          Format
        </button>
      </div>
    </div>
  )
}

export default TemplateEditor

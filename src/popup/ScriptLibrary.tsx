import type { TwpScriptTemplate } from '../scripts/twp-script-content'
import { twpScriptPages } from '../scripts/twp-pages'
import { stripScriptSuffix, filledPageCount } from './format'

const pages = Object.values(twpScriptPages)

interface ScriptLibraryProps {
  activeTabHost: string
  templates: TwpScriptTemplate[]
  selectedTemplateId: string
  onSelect: (id: string) => void
  onOpenEditor: (id: string) => void
  onRunRoutine: () => void
  onEdit: () => void
  onNew: () => void
}

function contentPreview(template: TwpScriptTemplate): string {
  const filled = pages.filter((page) => Boolean(template.content[page.id]))
  if (filled.length === 0) return 'no content yet'
  return filled.map((page) => stripScriptSuffix(page.label)).join(' · ')
}

function ScriptLibrary({
  activeTabHost,
  templates,
  selectedTemplateId,
  onSelect,
  onOpenEditor,
  onRunRoutine,
  onEdit,
  onNew,
}: ScriptLibraryProps) {
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '16px 18px 10px' }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.55)' }}>
            TWP Script Deployer
          </div>
          <h3 style={{ margin: '2px 0 0', fontSize: 23, letterSpacing: '-.02em' }}>Library</h3>
        </div>
        {activeTabHost && <span className="tag tag-accent">{activeTabHost}</span>}
      </div>

      <div style={{ padding: '0 18px', flex: 1, overflow: 'auto' }}>
        {templates.length === 0 && (
          <p style={{ fontSize: 12.5, fontStyle: 'italic', color: 'rgba(32,30,29,.58)' }}>
            No templates yet — start one with the ＋ button below.
          </p>
        )}
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplateId
          const edge = isSelected ? '#0088b0' : 'transparent'
          const bg = isSelected ? '#e9f8ff' : 'transparent'
          return (
            <div
              key={template.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(template.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(template.id)
                }
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'baseline',
                gap: '4px 12px',
                padding: '11px 10px 11px 12px',
                margin: '0 -10px 0 -12px',
                cursor: 'pointer',
                borderLeft: `3px solid ${edge}`,
                background: bg,
              }}
            >
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenEditor(template.id)
                }}
                style={{
                  fontSize: 16.5,
                  letterSpacing: '-.01em',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(0,136,176,.4)',
                  textUnderlineOffset: '3px',
                }}
              >
                {template.label}
              </span>
              <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(32,30,29,.5)' }}>
                {filledPageCount(template)} slots
              </span>
              <span style={{ gridColumn: '1/-1', fontSize: 12.5, color: 'rgba(32,30,29,.58)', fontStyle: 'italic' }}>
                {contentPreview(template)}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px 6px' }}>
        <button
          className="btn btn-primary"
          onClick={onRunRoutine}
          disabled={!selectedTemplate}
          style={{ flex: 1, minHeight: 40, fontSize: 15 }}
        >
          Run routine
        </button>
        <button className="btn btn-secondary" onClick={onEdit} disabled={!selectedTemplate} style={{ minHeight: 40 }}>
          Edit
        </button>
        <button className="btn btn-ghost" onClick={onNew} style={{ minHeight: 40 }} title="New template">
          ＋
        </button>
      </div>

      <div style={{ padding: '4px 18px 16px', fontSize: 11.5, color: 'rgba(32,30,29,.45)' }}>
        “{selectedTemplate?.label ?? ''}” writes to{' '}
        <span style={{ color: '#006786' }}>{selectedTemplate ? filledPageCount(selectedTemplate) : 0}</span> of 10 script
        pages
      </div>
    </div>
  )
}

export default ScriptLibrary

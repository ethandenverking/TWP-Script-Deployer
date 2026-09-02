import type { DeployRow } from './App'

interface DeploySheetProps {
  open: boolean
  phase: 'confirm' | 'running' | 'done'
  templateLabel: string
  rows: DeployRow[]
  onPrimary: () => void
  onDismiss: () => void
}

function describeRow(row: DeployRow, phase: DeploySheetProps['phase']) {
  if (phase === 'confirm') {
    return { mark: '+', markColor: '#0088b0', note: `${row.lines} ${row.lines === 1 ? 'line' : 'lines'}` }
  }
  if (row.status === 'saved') return { mark: '✓', markColor: '#0088b0', note: 'saved' }
  if (row.status === 'writing') return { mark: '›', markColor: '#d6006c', note: 'writing…' }
  if (row.status === 'error') return { mark: '!', markColor: '#d6006c', note: 'failed' }
  return { mark: '·', markColor: 'rgba(32,30,29,.35)', note: 'queued' }
}

function DeploySheet({ open, phase, templateLabel, rows, onPrimary, onDismiss }: DeploySheetProps) {
  if (!open) return null

  const kicker = phase === 'confirm' ? 'Confirm deploy' : phase === 'running' ? 'Deploying' : 'Complete'
  const title =
    phase === 'confirm'
      ? `“${templateLabel}” will change ${rows.length} pages`
      : phase === 'running'
        ? 'Writing to TWP…'
        : 'All pages saved'
  const cta = phase === 'confirm' ? 'Deploy now' : phase === 'running' ? 'Abort' : 'Done'
  const dismiss = phase === 'confirm' ? 'Cancel' : 'Close'

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(32,30,29,.42)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: '#f3f2f2', width: '100%', padding: 18, boxShadow: '0 -12px 32px rgba(45,43,43,.22)' }}>
        <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(32,30,29,.55)' }}>{kicker}</div>
        <h4 style={{ margin: '4px 0 12px', fontSize: 19 }}>{title}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 230, overflow: 'auto' }}>
          {rows.map((row) => {
            const { mark, markColor, note } = describeRow(row, phase)
            return (
              <div
                key={row.pageId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '16px 1fr auto',
                  alignItems: 'baseline',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(32,30,29,.08)',
                }}
              >
                <span style={{ fontSize: 13, color: markColor }}>{mark}</span>
                <span style={{ fontSize: 14 }}>{row.label}</span>
                <span style={{ fontSize: 11.5, color: 'rgba(32,30,29,.5)' }} title={row.error}>
                  {note}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={onPrimary} style={{ flex: 1, minHeight: 40 }}>
            {cta}
          </button>
          <button className="btn btn-ghost" onClick={onDismiss} style={{ minHeight: 40 }}>
            {dismiss}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeploySheet

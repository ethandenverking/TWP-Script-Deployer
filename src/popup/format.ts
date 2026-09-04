// Small display-formatting helpers shared by the popup views. Kept out of
// src/scripts/* since they're UI-label concerns, not deployment logic.

import { twpScriptPages } from '../scripts/twp-pages'
import type { TwpScriptTemplate } from '../scripts/twp-script-content'

const pages = Object.values(twpScriptPages)

// "RoundScript" -> "Round" for compact labels (rail, content-preview join).
export function stripScriptSuffix(label: string): string {
  return label.replace(/Script$/, '')
}

export function countNonBlankLines(text: string): number {
  return text.split('\n').filter((line) => line.trim() !== '').length
}

export function filledPageCountFromContent(content: Record<string, string>): number {
  return pages.filter((page) => Boolean(content[page.id])).length
}

export function filledPageCount(template: TwpScriptTemplate): number {
  return filledPageCountFromContent(template.content)
}

interface StripState {
  inBlockComment: boolean
}

// Strips string/comment contents from a line (replacing them with harmless
// filler) so bracket-counting below isn't confused by "{" inside a string or
// a comment. Block-comment state carries across lines.
function stripStringsAndComments(line: string, state: StripState): string {
  let out = ''
  let i = 0
  while (i < line.length) {
    if (state.inBlockComment) {
      const end = line.indexOf('*/', i)
      if (end === -1) return out
      state.inBlockComment = false
      i = end + 2
      continue
    }
    const ch = line[i]
    const next = line[i + 1]
    if (ch === '/' && next === '/') return out
    if (ch === '/' && next === '*') {
      state.inBlockComment = true
      i += 2
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      i++
      while (i < line.length && line[i] !== quote) {
        i += line[i] === '\\' ? 2 : 1
      }
      i++
      out += '_' // placeholder so string contents can't affect bracket counts
      continue
    }
    out += ch
    i++
  }
  return out
}

// Re-indents a code snippet based on curly/paren/square bracket nesting, so
// pasted or hand-typed TWP scripts line up correctly in the plaintext box.
export function reindentByBraces(code: string, indentSize = 2): string {
  const unit = ' '.repeat(indentSize)
  const lines = code.split(/\r\n|\r|\n/)
  const state: StripState = { inBlockComment: false }
  let depth = 0

  const result = lines.map((rawLine) => {
    const trimmed = rawLine.trim()
    if (trimmed === '') return ''

    const stripped = stripStringsAndComments(trimmed, state).trim()

    let leadingCloses = 0
    for (const ch of stripped) {
      if (ch === '}' || ch === ')' || ch === ']') leadingCloses++
      else break
    }

    let netDelta = 0
    for (const ch of stripped) {
      if (ch === '{' || ch === '(' || ch === '[') netDelta++
      else if (ch === '}' || ch === ')' || ch === ']') netDelta--
    }

    const printDepth = Math.max(depth - leadingCloses, 0)
    depth = Math.max(depth + netDelta, 0)

    return unit.repeat(printDepth) + trimmed
  })

  return result.join('\n')
}

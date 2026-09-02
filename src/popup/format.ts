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

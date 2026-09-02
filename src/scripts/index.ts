import { exampleScript } from './example-script'
import type { TwpScript } from './types'

// Registry of every deployable script. Add new scripts here to make them
// show up in the popup and run on matching pages.
export const scripts: TwpScript[] = [exampleScript]

export type { TwpScript }

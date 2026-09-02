import { exampleRoutine } from './example-routine'
import type { TwpScript } from './types'

// Registry of every deployable script. Add new scripts here to make them
// show up in the popup and run on matching pages.
export const scripts: TwpScript[] = [exampleRoutine]

export type { TwpScript }

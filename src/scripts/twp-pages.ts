// Registry of TWP's proprietary-scripting text boxes. Each account has the
// same set of pages/frames at the same URLs (auth comes from the browser's
// existing cookies), but only some are "activated" per account. Fill in the
// `url` for each slot you use; leave others blank/remove them.
export interface TwpScriptPage {
  // Stable key used to reference this slot from saved scripts/deploy actions.
  id: string
  // Human-readable name shown in the popup (e.g. "Accrual Rules").
  label: string
  // Full URL of the page/frame containing the scripting text box.
  url: string
  // Optional: CSS selector for the text box, if the generic "first textarea
  // on the page" guess doesn't find the right element.
  textareaSelector?: string
  // Optional: CSS selector for the save/submit button, if the generic guess
  // ("button/input containing 'Save'") doesn't find the right element.
  saveButtonSelector?: string
}

export const twpScriptPages: Record<string, TwpScriptPage> = {
  slot1: { id: 'otthreshold', label: 'OTThresholdScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=OTThresholdScript' },
  slot2: { id: 'addentry', label: 'AddEntryScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=AddEntryScript' },
}

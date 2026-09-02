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
  slot1: { id: 'round', label: 'RoundScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=RoundScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot2: { id: 'split', label: 'SplitScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=SplitScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot3: { id: 'reportingdate', label: 'ReportingDateScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=ReportingDateScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot4: { id: 'addentry', label: 'AddEntryScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=AddEntryScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot5: { id: 'splitpostreportingdate', label: 'SplitPostReportingDateScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=SplitPostReportingDateScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot6: { id: 'payrate', label: 'PayRateScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=PayRateScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot7: { id: 'accrueuptop', label: 'AccrueUpTopScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=AccrueUpScript', textareaSelector: '#txtScript1', saveButtonSelector: '#btnSave' },
  slot8: { id: 'accrueup', label: 'AccrueUpBottomScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=AccrueUpScript', textareaSelector: '#txtScript2', saveButtonSelector: '#btnSave' },
  slot9: { id: 'accruedown', label: 'AccrueDownScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=AccrueDownScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' },
  slot10: { id: 'otthreshold', label: 'OTThresholdScript', url: 'https://www.swipeclock.com/pg/RuleSetup/Generic.aspx?classname=OTThresholdScript', textareaSelector: '#txtScript', saveButtonSelector: '#btnSave' }
}


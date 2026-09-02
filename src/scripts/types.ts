// A single deployable unit of code that can be toggled on/off from the popup
// and gets executed on matching TimeWorksPlus pages.
export interface TwpScript {
  id: string
  name: string
  description: string
  // Only run on pages whose URL matches this pattern (undefined = all pages).
  urlPattern?: RegExp
  run: () => void
}

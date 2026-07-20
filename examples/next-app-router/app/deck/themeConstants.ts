/**
 * Exact hex values and font names extracted from the Ultraviolet console light theme
 * (packages/themes/src/themes/console/light/__generated__/index.ts).
 *
 * These constants are used BOTH in the React UI (for reference) and in pptxgenjs
 * slide builders — ensuring the exported .pptx visually matches the on-screen UI.
 */

// --- Colors (console light theme) ---
export const COLORS = {
  // Primary (purple / violet brand)
  primaryBackground: '#f1eefc',
  primaryBackgroundHover: '#e5dbfd',
  primaryBackgroundStrong: '#8c40ef',
  primaryBackgroundStrongHover: '#792dd4',
  primaryBorder: '#8c40ef',
  primaryText: '#641cb3',
  primaryTextStrong: '#ffffff',

  // Neutral
  neutralBackground: '#ffffff',
  neutralBackgroundWeak: '#f9f9fa',
  neutralBackgroundStrong: '#e9eaeb',
  neutralBackgroundStronger: '#151a2d', // Scaleway dark navy
  neutralBorder: '#d9dadd',
  neutralBorderStrong: '#b5b7bd',
  neutralText: '#222638',
  neutralTextWeak: '#3f4250',
  neutralTextStronger: '#151a2d',
  neutralTextStrong: '#ffffff',

  // Danger
  dangerBackgroundStrong: '#e51963',
  dangerText: '#b3144d',

  // Success
  successBackground: '#e6faf0',
  successBackgroundStrong: '#16a163',
  successText: '#0a7346',
  successTextStrong: '#ffffff',

  // Info
  infoBackgroundStrong: '#0078d2',
  infoText: '#005da3',
} as const

// --- Typography ---
export const FONTS = {
  headings: 'Space Grotesk',
  body: 'Inter',
} as const

// --- PPTX slide dimensions (16:9 in inches) ---
export const SLIDE = {
  width: 13.33,
  height: 7.5,
  margin: 0.5,
} as const

// --- Common PPTX text options ---
export const PPTX_TEXT = {
  headingColor: COLORS.neutralTextStronger,
  bodyColor: COLORS.neutralText,
  mutedColor: COLORS.neutralTextWeak,
  whiteColor: COLORS.neutralTextStrong,
  primaryColor: COLORS.primaryText,
  accentColor: COLORS.primaryBackgroundStrong,
} as const

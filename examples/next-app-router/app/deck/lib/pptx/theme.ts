/**
 * PPTX theme — the single source of truth for every slide builder.
 *
 * Values below are copied verbatim from Ultraviolet's generated console "light"
 * theme (the theme the on-screen UI renders with):
 *   packages/themes/src/themes/console/light/__generated__/index.ts
 *
 * We cannot `import { consoleLightTheme } from '@ultraviolet/themes'` at runtime
 * here: the package only ships a built `dist/` (no dist present in this checkout,
 * and its entry point pulls in a `.css` side-effect that only a webpack/Next build
 * can resolve, not a plain Node/browser bundle of this generator). Copying the
 * resolved values keeps this file the single place to edit while still tracing
 * every number back to its real source line, and the CI-run `analyse:dist`-style
 * spot check below documents exactly where each value came from so it can be
 * re-verified whenever the design team regenerates the theme.
 *
 * Source line references (as of this file's writing):
 *   colors.primary            -> lines 248-273
 *   colors.neutral             -> lines 68-118
 *   colors.danger               -> lines 16-41
 *   colors.success              -> lines 300-325
 *   colors.info                  -> lines 42-67
 *   colors.other.data.charts   -> lines 119-138
 *   typography.heading.fontFamily -> line 630
 *   typography.body.fontFamily    -> line 432
 *   radii.default / radii.large   -> lines 353-361
 *   space['1'] / space['2']       -> lines 414+
 */

export const theme = {
  colors: {
    primary: {
      background: '#f1eefc',
      backgroundHover: '#e5dbfd',
      backgroundStrong: '#8c40ef',
      backgroundStrongHover: '#792dd4',
      border: '#8c40ef',
      text: '#641cb3',
      textStrong: '#ffffff',
    },
    neutral: {
      background: '#ffffff',
      backgroundWeak: '#f9f9fa',
      backgroundStrong: '#e9eaeb',
      backgroundStronger: '#151a2d',
      border: '#d9dadd',
      borderStrong: '#b5b7bd',
      /** neutral.text — default body text on light backgrounds */
      text: '#3f4250',
      /** neutral.textStrong — emphasised body text (bold labels, headings on light bg) */
      textStrong: '#222638',
      /** neutral.textStronger — reserved for text on dark surfaces (it resolves to white) */
      textStrongOnDark: '#ffffff',
      /** neutral.textWeak — de-emphasised / muted text */
      textWeak: '#727683',
    },
    danger: {
      backgroundStrong: '#e51963',
      text: '#b3144d',
    },
    success: {
      background: '#daf6ec',
      backgroundStrong: '#2c8564',
      text: '#22674e',
    },
    info: {
      backgroundStrong: '#0078d2',
      text: '#005da3',
    },
    /** other.data.charts — Ultraviolet's dedicated categorical data-viz palette */
    chart: {
      data1: '#5e47be',
      data2: '#0083e6',
      data3: '#3ebd8f',
      data4: '#ac2740',
      data5: '#9a85ec',
      data6: '#ff602e',
    },
  },
  fonts: {
    heading: 'Space Grotesk',
    body: 'Inter',
  },
  /** radii, converted from rem (1rem = 16px) to inches (96px = 1in) for pptxgenjs shapes */
  radii: {
    default: (0.25 * 16) / 96,
    large: (0.5 * 16) / 96,
  },
  /** 16:9 slide geometry, in inches */
  slide: {
    width: 13.33,
    height: 7.5,
    margin: 0.5,
  },
} as const

export type PptxTheme = typeof theme

/**
 * PPTX theme — the single source of truth for every slide builder.
 * Colors, font families, line-height ratios, and letter spacing are copied
 * verbatim from Ultraviolet's generated console "light" theme (the theme the
 * on-screen UI renders with):
 *   packages/themes/src/themes/console/light/__generated__/index.ts
 *
 * We cannot `import { consoleLightTheme } from '@ultraviolet/themes'` at
 * runtime here: the package only ships a built `dist/`, and its entry point
 * pulls in a `.css` side-effect that only the Next build can resolve — not a
 * plain module graph. Copying the resolved values keeps this file the single
 * place to edit while tracing every value back to its source line, so it can
 * be re-verified whenever the design team regenerates the theme.
 *
 * Source line references (packages/themes/.../light/__generated__/index.ts):
 *   colors.primary                 -> lines 248-273
 *   colors.neutral                 -> lines 68-118
 *   colors.danger                  -> lines 16-41
 *   colors.success                 -> lines 300-325
 *   colors.info                    -> lines 42-67
 *   colors.other.data.charts       -> lines 119-138
 *   typography.heading.fontFamily  -> 'Space Grotesk, sans-serif' (line 631)
 *   typography.body.fontFamily     -> 'Inter, sans-serif' (line 433)
 *   line-height ratios             -> computed from each variant's
 *                                     fontSize/lineHeight rem pair (see below)
 *   letterSpacing                  -> '0' on every Ultraviolet variant
 *   radii.default / radii.large    -> lines 353-361
 *
 * Point sizes are PPTX-specific (Ultraviolet defines a web rem scale, not a
 * slide scale) but are defined ONCE here — builders never pick a size ad hoc.
 */

/** One text style step: point size + Ultraviolet-derived line-height ratio. */
export interface TypeStep {
  size: number
  /** pptxgenjs `lineSpacingMultiple` — ratio taken from the UV variant noted per step */
  lineSpacingMultiple: number
  /** pptxgenjs `charSpacing` in points — UV letterSpacing is '0' everywhere */
  charSpacing: number
}

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
      /** neutral.textStronger — text on dark surfaces (resolves to white) */
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

  /**
   * The type scale. Every piece of text on every slide uses exactly one of
   * these steps — no builder may pass a literal font size.
   * Line-height ratios come from the named Ultraviolet variant.
   */
  typography: {
    /** Cover title. Ratio from UV `headingLarge` (2.1875rem/3rem = 1.371). */
    display: { size: 32, lineSpacingMultiple: 1.371, charSpacing: 0 } as TypeStep,
    /** Content-slide title in the header bar. Ratio from UV `heading` (1.5625/2 = 1.28). */
    slideTitle: { size: 18, lineSpacingMultiple: 1.28, charSpacing: 0 } as TypeStep,
    /** Cover subtitle / section labels. Ratio from UV `headingSmall` (1.3125/2 = 1.524). */
    subtitle: { size: 16, lineSpacingMultiple: 1.524, charSpacing: 0 } as TypeStep,
    /** Default body copy (roadmap bullets, empty states). Ratio from UV `body` (1/1.5). */
    body: { size: 14, lineSpacingMultiple: 1.5, charSpacing: 0 } as TypeStep,
    /** Dense body copy (risks bullets, cover metadata). Ratio from UV `bodySmall` (0.875/1.25 = 1.429). */
    bodySmall: { size: 11, lineSpacingMultiple: 1.429, charSpacing: 0 } as TypeStep,
    /** Table cells at default density. Ratio from UV `bodySmall`. */
    table: { size: 11, lineSpacingMultiple: 1.429, charSpacing: 0 } as TypeStep,
    /** Footer / fine print. Ratio from UV `caption` (0.75rem/1rem = 1.333). */
    caption: { size: 8, lineSpacingMultiple: 1.333, charSpacing: 0 } as TypeStep,
    /**
     * The all-caps deck-type label on the cover. PPTX-specific style: UV has
     * no overline variant, so the 2pt tracking here is a deliberate slide
     * design choice, not a UV token.
     */
    overline: { size: 10, lineSpacingMultiple: 1.333, charSpacing: 2 } as TypeStep,
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

  /**
   * Shared layout grid — the same guides on every content slide, so left
   * edges, title baselines, and content bands align deck-wide.
   */
  layout: {
    /** Height of the purple title bar at the top of content slides */
    headerH: 0.65,
    /** Top edge of the content band on every content slide */
    contentTop: 0.95,
    /** Bottom edge of the content band (footer bar sits below at 7.2) */
    contentBottom: 7.05,
    /** contentBottom - contentTop, the full usable content height */
    contentH: 6.1,
    /** Height of the footer bar */
    footerH: 0.3,
    /** Horizontal gap between columns/cards */
    gutter: 0.2,
    /** Inner padding used inside cards/columns, in inches */
    cardPadding: 0.15,
  },
} as const

export type PptxTheme = typeof theme

/**
 * Cover slide — always the first slide.
 * Dark navy background with white text and the Scaleway purple accent strip.
 *
 * Layout contract: every element has a fixed vertical slot sized for the
 * worst case its content can reach after truncation, so no two elements can
 * ever overlap regardless of input length.
 *   overline 1.70 · title 2.15-3.75 · subtitle 3.90 · divider 4.55
 *   client 4.75 · date 5.25
 */

import type PptxGenJS from 'pptxgenjs'
import { setDarkBackground } from '../chrome'
import { fitFontSize, truncate } from '../format'
import type { PptxTheme } from '../theme'

export interface CoverSlideData {
  title: string
  subtitle: string
  clientName: string
  date: string
  deckType: string
}

/** Title never exceeds 200 chars; at the 20pt floor in an 11" box that is at
 * most 3 wrapped lines, which fits the 1.6" title slot. */
const MAX_TITLE_CHARS = 200
/** Client name never exceeds 110 chars; at the 10pt floor that is a single
 * line well inside the content width. */
const MAX_CLIENT_CHARS = 110

export function buildCoverSlide(pptx: PptxGenJS, data: CoverSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setDarkBackground(slide, theme)

  const { display, subtitle, body, bodySmall, overline } = theme.typography

  // Accent strips: top, bottom, left sidebar
  for (const strip of [
    { x: 0, y: 0, w: theme.slide.width, h: 0.08 },
    { x: 0, y: theme.slide.height - 0.08, w: theme.slide.width, h: 0.08 },
    { x: 0, y: 0, w: 0.08, h: theme.slide.height },
  ]) {
    slide.addShape('rect', { ...strip, fill: { color: theme.colors.primary.backgroundStrong } })
  }

  // Deck type label (overline)
  slide.addText(data.deckType.toUpperCase(), {
    x: theme.slide.margin,
    y: 1.7,
    w: 6,
    h: 0.35,
    fontSize: overline.size,
    lineSpacingMultiple: overline.lineSpacingMultiple,
    charSpacing: overline.charSpacing,
    color: theme.colors.primary.backgroundStrong,
    fontFace: theme.fonts.body,
    bold: true,
  })

  // Main title — size stepped down for long titles, hard-capped at 200 chars
  const title = truncate(data.title, MAX_TITLE_CHARS)
  const titleFontSize = fitFontSize(title, {
    baseSize: display.size,
    baseChars: 45,
    minSize: 20,
  })
  slide.addText(title, {
    x: theme.slide.margin,
    y: 2.15,
    w: 11,
    h: 1.6,
    fontSize: titleFontSize,
    lineSpacingMultiple: display.lineSpacingMultiple,
    charSpacing: display.charSpacing,
    bold: true,
    color: theme.colors.neutral.textStrongOnDark,
    fontFace: theme.fonts.heading,
    wrap: true,
    valign: 'top',
  })

  // Subtitle is optional; when absent, the divider/client/date block moves up
  // so the cover doesn't keep a dead gap where the subtitle would have been.
  // The title slot ends at 3.75, so the shifted divider (4.1) still clears it.
  const blockShift = data.subtitle ? 0 : -0.45

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: theme.slide.margin,
      y: 3.9,
      w: 11,
      h: 0.4,
      fontSize: subtitle.size,
      lineSpacingMultiple: subtitle.lineSpacingMultiple,
      charSpacing: subtitle.charSpacing,
      color: theme.colors.primary.backgroundHover,
      fontFace: theme.fonts.body,
    })
  }

  // Divider
  slide.addShape('line', {
    x: theme.slide.margin,
    y: 4.55 + blockShift,
    w: 5,
    h: 0,
    line: { color: theme.colors.primary.backgroundStrong, width: 1 },
  })

  // Client name — truncated and stepped down so it is always a single line
  const clientName = truncate(data.clientName, MAX_CLIENT_CHARS)
  const clientFontSize = fitFontSize(clientName, {
    baseSize: body.size,
    baseChars: 70,
    minSize: 10,
  })
  slide.addText(`Prepared for: ${clientName}`, {
    x: theme.slide.margin,
    y: 4.75 + blockShift,
    w: theme.slide.width - theme.slide.margin * 2,
    h: 0.4,
    fontSize: clientFontSize,
    lineSpacingMultiple: body.lineSpacingMultiple,
    charSpacing: body.charSpacing,
    color: theme.colors.neutral.textStrongOnDark,
    fontFace: theme.fonts.body,
    valign: 'middle',
  })

  // Date
  slide.addText(data.date, {
    x: theme.slide.margin,
    y: 5.25 + blockShift,
    w: 8,
    h: 0.3,
    fontSize: bodySmall.size,
    lineSpacingMultiple: bodySmall.lineSpacingMultiple,
    charSpacing: bodySmall.charSpacing,
    color: theme.colors.neutral.borderStrong,
    fontFace: theme.fonts.body,
  })
}

/**
 * Cover slide — always the first slide.
 * Dark navy background with white text and the Scaleway purple accent strip.
 */

import type PptxGenJS from 'pptxgenjs'
import { setDarkBackground } from '../chrome'
import { fitFontSize } from '../format'
import type { PptxTheme } from '../theme'

export interface CoverSlideData {
  title: string
  subtitle: string
  clientName: string
  date: string
  deckType: string
}

export function buildCoverSlide(pptx: PptxGenJS, data: CoverSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setDarkBackground(slide, theme)

  // Top accent strip
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: theme.slide.width,
    h: 0.08,
    fill: { color: theme.colors.primary.backgroundStrong },
  })

  // Bottom accent strip
  slide.addShape('rect', {
    x: 0,
    y: theme.slide.height - 0.08,
    w: theme.slide.width,
    h: 0.08,
    fill: { color: theme.colors.primary.backgroundStrong },
  })

  // Left purple sidebar
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 0.08,
    h: theme.slide.height,
    fill: { color: theme.colors.primary.backgroundStrong },
  })

  // Deck type label
  slide.addText(data.deckType.toUpperCase(), {
    x: theme.slide.margin,
    y: 1.8,
    w: 6,
    h: 0.4,
    fontSize: 10,
    color: theme.colors.primary.backgroundStrong,
    fontFace: theme.fonts.body,
    bold: true,
  })

  // Main title — shrinks for long project titles so it never overflows its box
  const titleFontSize = fitFontSize(data.title, { baseSize: 36, baseChars: 40, minSize: 22 })
  slide.addText(data.title, {
    x: theme.slide.margin,
    y: 2.2,
    w: 9,
    h: 1.4,
    fontSize: titleFontSize,
    bold: true,
    color: theme.colors.neutral.textStrongOnDark,
    fontFace: theme.fonts.heading,
    wrap: true,
    fit: 'shrink',
    valign: 'top',
  })

  // Subtitle / project description
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: theme.slide.margin,
      y: 3.65,
      w: 9,
      h: 0.5,
      fontSize: 16,
      color: theme.colors.primary.backgroundHover,
      fontFace: theme.fonts.body,
    })
  }

  // Divider
  slide.addShape('line', {
    x: theme.slide.margin,
    y: 4.3,
    w: 5,
    h: 0,
    line: { color: theme.colors.primary.backgroundStrong, width: 1 },
  })

  // Client name — long names wrap rather than overflow off-slide
  const clientFontSize = fitFontSize(data.clientName, { baseSize: 12, baseChars: 55, minSize: 9 })
  slide.addText(`Prepared for: ${data.clientName}`, {
    x: theme.slide.margin,
    y: 4.5,
    w: theme.slide.width - theme.slide.margin * 2,
    h: 0.35,
    fontSize: clientFontSize,
    color: theme.colors.neutral.textStrongOnDark,
    fontFace: theme.fonts.body,
    wrap: true,
  })

  // Date
  slide.addText(data.date, {
    x: theme.slide.margin,
    y: 4.85,
    w: 8,
    h: 0.3,
    fontSize: 11,
    color: theme.colors.neutral.borderStrong,
    fontFace: theme.fonts.body,
  })
}

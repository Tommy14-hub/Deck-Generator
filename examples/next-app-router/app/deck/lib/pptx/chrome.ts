/** Shared slide chrome (backgrounds, header bar, footer, empty states).
 * Every content slide gets its title, footer, and placeholder styling from
 * here so positions and type steps are identical deck-wide. */

import type PptxGenJS from 'pptxgenjs'
import type { PptxTheme } from './theme'

export function setDarkBackground(slide: PptxGenJS.Slide, theme: PptxTheme) {
  slide.background = { color: theme.colors.neutral.backgroundStronger }
}

export function setLightBackground(slide: PptxGenJS.Slide, theme: PptxTheme) {
  slide.background = { color: theme.colors.neutral.background }
}

/** Purple title bar across the top of a content slide. Title is vertically
 * centred in the bar and sits on the shared left guide (slide.margin). */
export function addSlideHeader(slide: PptxGenJS.Slide, title: string, theme: PptxTheme) {
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: theme.slide.width,
    h: theme.layout.headerH,
    fill: { color: theme.colors.primary.backgroundStrong },
  })
  slide.addText(title, {
    x: theme.slide.margin,
    y: 0,
    w: theme.slide.width - theme.slide.margin * 2,
    h: theme.layout.headerH,
    fontSize: theme.typography.slideTitle.size,
    lineSpacingMultiple: theme.typography.slideTitle.lineSpacingMultiple,
    charSpacing: theme.typography.slideTitle.charSpacing,
    bold: true,
    color: theme.colors.primary.textStrong,
    fontFace: theme.fonts.heading,
    valign: 'middle',
  })
}

/** Scaleway-branded footer bar at the bottom of every content slide */
export function addFooter(slide: PptxGenJS.Slide, date: string, theme: PptxTheme) {
  slide.addShape('rect', {
    x: 0,
    y: theme.slide.height - theme.layout.footerH,
    w: theme.slide.width,
    h: theme.layout.footerH,
    fill: { color: theme.colors.primary.backgroundStrong },
  })
  slide.addText(`Scaleway  ·  ${date}`, {
    x: theme.slide.margin,
    y: theme.slide.height - theme.layout.footerH,
    w: theme.slide.width - theme.slide.margin * 2,
    h: theme.layout.footerH,
    fontSize: theme.typography.caption.size,
    lineSpacingMultiple: theme.typography.caption.lineSpacingMultiple,
    charSpacing: theme.typography.caption.charSpacing,
    color: theme.colors.primary.textStrong,
    fontFace: theme.fonts.body,
    align: 'right',
    valign: 'middle',
  })
}

/** Uniform "no data" placeholder, centred in the content band at the same
 * position on every slide type that can be empty. */
export function addEmptyState(slide: PptxGenJS.Slide, message: string, theme: PptxTheme) {
  slide.addText(message, {
    x: theme.slide.margin,
    y: theme.layout.contentTop + 2,
    w: theme.slide.width - theme.slide.margin * 2,
    h: 1,
    fontSize: theme.typography.body.size,
    lineSpacingMultiple: theme.typography.body.lineSpacingMultiple,
    charSpacing: theme.typography.body.charSpacing,
    italic: true,
    color: theme.colors.neutral.textWeak,
    fontFace: theme.fonts.body,
    align: 'center',
    valign: 'middle',
  })
}

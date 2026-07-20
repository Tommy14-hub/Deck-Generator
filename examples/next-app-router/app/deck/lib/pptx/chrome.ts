/** Shared slide chrome (backgrounds, header bar, footer) reused across builders. */

import type PptxGenJS from 'pptxgenjs'
import type { PptxTheme } from './theme'

export function setDarkBackground(slide: PptxGenJS.Slide, theme: PptxTheme) {
  slide.background = { color: theme.colors.neutral.backgroundStronger }
}

export function setLightBackground(slide: PptxGenJS.Slide, theme: PptxTheme) {
  slide.background = { color: theme.colors.neutral.background }
}

/** Reusable purple header bar across the top of a content slide */
export function addSlideHeader(slide: PptxGenJS.Slide, title: string, theme: PptxTheme) {
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: theme.slide.width,
    h: 0.65,
    fill: { color: theme.colors.primary.backgroundStrong },
  })
  slide.addText(title, {
    x: theme.slide.margin,
    y: 0.08,
    w: theme.slide.width - theme.slide.margin * 2,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: theme.colors.primary.textStrong,
    fontFace: theme.fonts.heading,
  })
}

/** Scaleway-branded footer bar at the bottom of every slide */
export function addFooter(slide: PptxGenJS.Slide, date: string, theme: PptxTheme) {
  slide.addShape('rect', {
    x: 0,
    y: theme.slide.height - 0.3,
    w: theme.slide.width,
    h: 0.3,
    fill: { color: theme.colors.primary.backgroundStrong },
  })
  slide.addText(`Scaleway  ·  ${date}`, {
    x: theme.slide.margin,
    y: theme.slide.height - 0.28,
    w: theme.slide.width - theme.slide.margin * 2,
    h: 0.25,
    fontSize: 8,
    color: theme.colors.primary.textStrong,
    fontFace: theme.fonts.body,
    align: 'right',
  })
}

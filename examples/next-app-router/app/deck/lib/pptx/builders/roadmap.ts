/**
 * Roadmap / Next Steps slide — bulleted list of action items.
 *
 * Overflow policy (explicit — `fit:'shrink'` is NOT relied on because it only
 * applies after the text is edited in PowerPoint):
 *   - <=6 items:  body size (14pt), roomy paragraph spacing
 *   - <=10 items: 12pt, items truncated to 160 chars (max two wrapped lines)
 *   - <=14 items: 11pt, items truncated to 110 chars (single line each)
 *   - >14 items:  first 14 render, then a "+ N more actions" caption line
 * Worst case (14 single-line items + caption) totals ~4.5", inside the 6.1"
 * content band.
 */

import type PptxGenJS from 'pptxgenjs'
import { addEmptyState, addFooter, addSlideHeader, setLightBackground } from '../chrome'
import { truncate } from '../format'
import type { PptxTheme } from '../theme'

export interface RoadmapSlideData {
  items: string[]
  date: string
}

const MAX_VISIBLE_ITEMS = 14

export function buildRoadmapSlide(pptx: PptxGenJS, data: RoadmapSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setLightBackground(slide, theme)
  addSlideHeader(slide, 'Roadmap / Next Steps', theme)
  addFooter(slide, data.date, theme)

  const items = data.items.map(i => i.trim()).filter(i => i.length > 0)

  if (items.length === 0) {
    addEmptyState(slide, 'No roadmap items defined.', theme)
    return
  }

  const visible = items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = items.length - visible.length

  const { body, bodySmall, caption } = theme.typography
  const density =
    visible.length <= 6
      ? { fontSize: body.size, maxChars: 200, paraSpaceAfter: 12 }
      : visible.length <= 10
        ? { fontSize: 12, maxChars: 160, paraSpaceAfter: 8 }
        : { fontSize: bodySmall.size, maxChars: 110, paraSpaceAfter: 6 }

  const paragraphs: PptxGenJS.TextProps[] = visible.map(item => ({
    text: truncate(item, density.maxChars),
    options: {
      bullet: { code: '2714', color: theme.colors.primary.backgroundStrong },
      paraSpaceAfter: density.paraSpaceAfter,
      indentLevel: 0,
      breakLine: true,
    },
  }))

  if (hiddenCount > 0) {
    // Trailing caption-prominence line for the items that didn't fit
    paragraphs.push({
      text: `+ ${hiddenCount} more action${hiddenCount > 1 ? 's' : ''} tracked outside this deck`,
      options: {
        bullet: false,
        paraSpaceBefore: 6,
        indentLevel: 0,
        breakLine: true,
        color: theme.colors.neutral.textWeak,
        fontSize: caption.size + 2,
        italic: true,
      },
    })
  }

  slide.addText(paragraphs, {
    x: theme.slide.margin,
    y: theme.layout.contentTop,
    w: theme.slide.width - theme.slide.margin * 2,
    h: theme.layout.contentH,
    fontSize: density.fontSize,
    lineSpacingMultiple: body.lineSpacingMultiple,
    charSpacing: body.charSpacing,
    color: theme.colors.neutral.text,
    fontFace: theme.fonts.body,
    valign: 'top',
  })
}

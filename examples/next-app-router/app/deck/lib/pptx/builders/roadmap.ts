/**
 * Roadmap / Next Steps slide — simple bulleted list.
 */

import type PptxGenJS from 'pptxgenjs'
import { addFooter, addSlideHeader, setLightBackground } from '../chrome'
import type { PptxTheme } from '../theme'

export interface RoadmapSlideData {
  items: string[]
  date: string
}

export function buildRoadmapSlide(pptx: PptxGenJS, data: RoadmapSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setLightBackground(slide, theme)
  addSlideHeader(slide, 'Roadmap / Next Steps', theme)
  addFooter(slide, data.date, theme)

  const items = data.items.filter(item => item.trim().length > 0)

  if (items.length === 0) {
    slide.addText('No roadmap items defined.', {
      x: theme.slide.margin,
      y: 2,
      w: theme.slide.width - theme.slide.margin * 2,
      h: 1,
      fontSize: 14,
      color: theme.colors.neutral.textWeak,
      fontFace: theme.fonts.body,
      align: 'center',
    })
    return
  }

  // Long lists get a smaller font so they still fit within the slide body
  const fontSize = items.length > 8 ? 12 : 14

  const bullets = items.map(item => ({
    text: item,
    options: {
      bullet: { code: '2714', color: theme.colors.primary.backgroundStrong },
      paraSpaceAfter: 8,
      indentLevel: 0,
      breakLine: true,
    },
  }))

  slide.addText(bullets, {
    x: theme.slide.margin,
    y: 0.9,
    w: theme.slide.width - theme.slide.margin * 2,
    h: theme.slide.height - 1.5,
    fontSize,
    color: theme.colors.neutral.text,
    fontFace: theme.fonts.body,
    valign: 'top',
    fit: 'shrink',
  })
}

/**
 * Hyperscaler Risks slide — 3-column layout for a client proposal.
 * Columns: Economic Risk | Risk to Innovation | Legal & Sovereignty
 */

import type PptxGenJS from 'pptxgenjs'
import { addFooter, addSlideHeader, setLightBackground } from '../chrome'
import type { PptxTheme } from '../theme'

export interface RisksSlideData {
  date: string
}

const COLUMNS: Array<{ title: string; points: string[] }> = [
  {
    title: 'Economic Risk',
    points: [
      'Lock-in to proprietary pricing',
      'Hidden egress & transfer fees',
      'Unpredictable cost escalations',
      'Currency exposure (USD billing)',
      'Dependency on exchange-rate volatility',
    ],
  },
  {
    title: 'Risk to Innovation',
    points: [
      'Proprietary APIs slow migration',
      'Feature roadmap driven by hyperscaler priorities',
      'Limited customisation & bare-metal access',
      'Longer procurement & approval cycles',
      'Dependency creates single point of failure',
    ],
  },
  {
    title: 'Legal & Sovereignty',
    points: [
      'GDPR & data residency uncertainties',
      'Cloud Act exposure (US jurisdiction)',
      'Non-EU data processing risks',
      'Limited auditability of sub-processors',
      'Contractual terms favour the provider',
    ],
  },
]

export function buildRisksSlide(pptx: PptxGenJS, data: RisksSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setLightBackground(slide, theme)
  addSlideHeader(slide, 'Hyperscaler Risks', theme)
  addFooter(slide, data.date, theme)

  const colW = (theme.slide.width - theme.slide.margin * 2 - 0.4) / 3
  const colY = 0.9
  const colH = theme.slide.height - colY - 0.5

  COLUMNS.forEach((col, i) => {
    const x = theme.slide.margin + i * (colW + 0.2)

    // Column header box
    slide.addShape('rect', {
      x,
      y: colY,
      w: colW,
      h: 0.5,
      fill: { color: theme.colors.primary.background },
      line: { color: theme.colors.primary.border, width: 1 },
    })
    slide.addText(col.title, {
      x,
      y: colY,
      w: colW,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: theme.colors.primary.text,
      fontFace: theme.fonts.heading,
      align: 'center',
      valign: 'middle',
    })

    // Column body
    slide.addShape('rect', {
      x,
      y: colY + 0.5,
      w: colW,
      h: colH - 0.5,
      fill: { color: theme.colors.neutral.backgroundWeak },
      line: { color: theme.colors.neutral.border, width: 1 },
    })

    // Bullet points
    const bullets = col.points.map(p => ({
      text: p,
      options: { bullet: { type: 'bullet' as const }, breakLine: true },
    }))
    slide.addText(bullets, {
      x: x + 0.12,
      y: colY + 0.65,
      w: colW - 0.24,
      h: colH - 0.8,
      fontSize: 10,
      color: theme.colors.neutral.text,
      fontFace: theme.fonts.body,
      valign: 'top',
    })
  })
}

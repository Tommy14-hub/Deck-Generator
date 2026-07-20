/**
 * Hyperscaler Risks slide — 3-column card layout for a client proposal.
 * Columns: Economic Risk | Risk to Innovation | Legal & Sovereignty
 * Static curated content; geometry comes entirely from the shared layout grid.
 */

import type PptxGenJS from 'pptxgenjs'
import { addFooter, addSlideHeader, setLightBackground } from '../chrome'
import type { PptxTheme } from '../theme'

export interface RisksSlideData {
  date: string
}

const COLUMN_HEADER_H = 0.5
/** Card body height, sized to the static 5-bullet content (worst column wraps
 * to 6 lines ≈ 1.9") plus breathing room — NOT the full content band, which
 * left the bottom half of each card visibly empty. */
const CARD_BODY_H = 2.5

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

  const { gutter, contentTop, cardPadding } = theme.layout
  const { subtitle, bodySmall } = theme.typography

  const colW = (theme.slide.width - theme.slide.margin * 2 - gutter * 2) / 3
  const colH = COLUMN_HEADER_H + CARD_BODY_H

  COLUMNS.forEach((col, i) => {
    const x = theme.slide.margin + i * (colW + gutter)

    // Column header box
    slide.addShape('rect', {
      x,
      y: contentTop,
      w: colW,
      h: COLUMN_HEADER_H,
      fill: { color: theme.colors.primary.background },
      line: { color: theme.colors.primary.border, width: 1 },
    })
    slide.addText(col.title, {
      x,
      y: contentTop,
      w: colW,
      h: COLUMN_HEADER_H,
      fontSize: subtitle.size - 2,
      lineSpacingMultiple: subtitle.lineSpacingMultiple,
      charSpacing: subtitle.charSpacing,
      bold: true,
      color: theme.colors.primary.text,
      fontFace: theme.fonts.heading,
      align: 'center',
      valign: 'middle',
    })

    // Column body card
    slide.addShape('rect', {
      x,
      y: contentTop + COLUMN_HEADER_H,
      w: colW,
      h: colH - COLUMN_HEADER_H,
      fill: { color: theme.colors.neutral.backgroundWeak },
      line: { color: theme.colors.neutral.border, width: 1 },
    })

    // Bullet points
    const bullets = col.points.map(p => ({
      text: p,
      options: {
        bullet: { type: 'bullet' as const },
        breakLine: true,
        paraSpaceAfter: 8,
      },
    }))
    slide.addText(bullets, {
      x: x + cardPadding,
      y: contentTop + COLUMN_HEADER_H + cardPadding,
      w: colW - cardPadding * 2,
      h: colH - COLUMN_HEADER_H - cardPadding * 2,
      fontSize: bodySmall.size,
      lineSpacingMultiple: bodySmall.lineSpacingMultiple,
      charSpacing: bodySmall.charSpacing,
      color: theme.colors.neutral.text,
      fontFace: theme.fonts.body,
      valign: 'top',
    })
  })
}

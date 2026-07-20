/**
 * Investment Summary (Pricing) slide — table with a purple header row,
 * alternating light-gray / white rows, and a bold total row at the bottom.
 * Column widths adapt to the longest content in each column.
 */

import type PptxGenJS from 'pptxgenjs'
import type { PricingRow } from '../../../types'
import { addFooter, addSlideHeader, setLightBackground } from '../chrome'
import { formatEur, truncate } from '../format'
import type { PptxTheme } from '../theme'

export interface PricingSlideData {
  rows: PricingRow[]
  date: string
}

const MAX_CELL_LENGTH = 60
const COLUMN_HEADERS = ['Service', 'Configuration', 'Qty', 'Unit Price', 'Subtotal']
/** Minimum inches per column so short content never collapses the layout */
const MIN_COL_WIDTHS = [1.6, 1.4, 0.7, 1.1, 1.1]

/**
 * Distribute the available table width across columns proportionally to the
 * longest string each column actually holds, respecting per-column minimums.
 */
function computeColumnWidths(rows: PricingRow[], totalWidth: number): number[] {
  const maxLengths = COLUMN_HEADERS.map((header, i) => {
    const cellLengths = rows.map(r => {
      const value = [r.serviceName, r.configuration, r.quantity, r.unitPrice, r.unitPrice][i]
      return Math.min(value?.length ?? 0, MAX_CELL_LENGTH)
    })
    return Math.max(header.length, ...cellLengths, 1)
  })

  const totalMin = MIN_COL_WIDTHS.reduce((a, b) => a + b, 0)
  const remaining = Math.max(0, totalWidth - totalMin)
  const totalWeight = maxLengths.reduce((a, b) => a + b, 0)

  const widths = MIN_COL_WIDTHS.map((min, i) => min + (remaining * maxLengths[i]) / totalWeight)

  // Rounding can drift the sum away from totalWidth by a fraction of an inch;
  // correct it on the widest column so pptxgenjs always gets an exact total.
  const drift = totalWidth - widths.reduce((a, b) => a + b, 0)
  const widestIdx = widths.indexOf(Math.max(...widths))
  widths[widestIdx] += drift

  return widths
}

export function buildPricingSlide(pptx: PptxGenJS, data: PricingSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setLightBackground(slide, theme)
  addSlideHeader(slide, 'Investment Summary', theme)
  addFooter(slide, data.date, theme)

  const tableX = theme.slide.margin
  const tableY = 0.85
  const tableW = theme.slide.width - theme.slide.margin * 2

  if (data.rows.length === 0) {
    slide.addText('No pricing rows have been defined for this proposal.', {
      x: tableX,
      y: 2.5,
      w: tableW,
      h: 1,
      fontSize: 14,
      color: theme.colors.neutral.textWeak,
      fontFace: theme.fonts.body,
      align: 'center',
    })
    return
  }

  const total = data.rows.reduce((sum, r) => {
    const qty = parseFloat(r.quantity) || 0
    const price = parseFloat(r.unitPrice) || 0
    return sum + qty * price
  }, 0)

  const headerRow: PptxGenJS.TableRow = COLUMN_HEADERS.map((text, i) => ({
    text,
    options: {
      bold: true,
      color: theme.colors.primary.textStrong,
      fill: { color: theme.colors.primary.backgroundStrong },
      fontFace: theme.fonts.heading,
      align: i >= 2 ? ('right' as const) : ('left' as const),
    },
  }))
  // Qty column reads better centered
  headerRow[2].options = { ...headerRow[2].options, align: 'center' }

  const dataRows: PptxGenJS.TableRow[] = data.rows.map((r, idx) => {
    const qty = parseFloat(r.quantity) || 0
    const price = parseFloat(r.unitPrice) || 0
    const subtotal = qty * price
    const bg = idx % 2 === 0 ? theme.colors.neutral.background : theme.colors.neutral.backgroundWeak
    return [
      {
        text: truncate(r.serviceName, MAX_CELL_LENGTH),
        options: { fill: { color: bg }, fontFace: theme.fonts.body },
      },
      {
        text: truncate(r.configuration, MAX_CELL_LENGTH),
        options: { fill: { color: bg }, fontFace: theme.fonts.body },
      },
      {
        text: String(qty),
        options: { fill: { color: bg }, fontFace: theme.fonts.body, align: 'center' as const },
      },
      {
        text: formatEur(price),
        options: { fill: { color: bg }, fontFace: theme.fonts.body, align: 'right' as const },
      },
      {
        text: formatEur(subtotal),
        options: { fill: { color: bg }, fontFace: theme.fonts.body, align: 'right' as const },
      },
    ]
  })

  const totalRow: PptxGenJS.TableRow = [
    {
      text: 'Total Estimated Monthly Cost',
      options: {
        colspan: 4,
        bold: true,
        color: theme.colors.neutral.textStrongOnDark,
        fill: { color: theme.colors.neutral.backgroundStronger },
        fontFace: theme.fonts.heading,
      },
    },
    {
      text: formatEur(total),
      options: {
        bold: true,
        color: theme.colors.neutral.textStrongOnDark,
        fill: { color: theme.colors.neutral.backgroundStronger },
        fontFace: theme.fonts.heading,
        align: 'right',
      },
    },
  ]

  slide.addTable([headerRow, ...dataRows, totalRow], {
    x: tableX,
    y: tableY,
    w: tableW,
    colW: computeColumnWidths(data.rows, tableW),
    fontSize: 11,
    border: { type: 'solid', color: theme.colors.neutral.border, pt: 0.5 },
    rowH: 0.38,
    valign: 'middle',
  })
}

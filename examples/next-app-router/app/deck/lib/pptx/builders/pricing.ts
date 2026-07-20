/**
 * Investment Summary (Pricing) slide — table with a purple header row,
 * alternating white/light-gray rows, and a bold total row.
 *
 * Overflow policy (explicit, in priority order):
 *   1. Row height adapts between 0.42" (airy, few rows) and 0.26" (dense).
 *   2. Cell font steps down with row height: 11pt -> 10pt -> 9pt.
 *   3. Past 21 data rows the table is capped: the first 20 rows render,
 *      followed by an "+ N more service lines" indicator row. The total row
 *      ALWAYS sums every input row (cent-rounded), never just the visible ones.
 * pptxgenjs autoPage is explicitly disabled so the library can never spill
 * rows onto an unstyled second slide behind our back.
 */

import type PptxGenJS from 'pptxgenjs'
import type { PricingRow } from '../../../types'
import { addEmptyState, addFooter, addSlideHeader, setLightBackground } from '../chrome'
import { formatEur, roundCents, truncate } from '../format'
import type { PptxTheme } from '../theme'

export interface PricingSlideData {
  rows: PricingRow[]
  date: string
}

const MAX_CELL_LENGTH = 60
const COLUMN_HEADERS = ['Service', 'Configuration', 'Qty', 'Unit Price', 'Subtotal']
/** Minimum inches per column so short content never collapses the layout */
const MIN_COL_WIDTHS = [1.6, 1.4, 0.7, 1.1, 1.1]

const ROW_H_MAX = 0.42
const ROW_H_MIN = 0.26
/** floor(contentH / ROW_H_MIN) - header - total = 23 - 2 */
const MAX_DATA_ROWS = 21
/** When capped, show this many real rows before the indicator row */
const CAPPED_VISIBLE_ROWS = 20

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
  const tableY = theme.layout.contentTop
  const tableW = theme.slide.width - theme.slide.margin * 2

  if (data.rows.length === 0) {
    addEmptyState(slide, 'No pricing rows have been defined for this proposal.', theme)
    return
  }

  const capped = data.rows.length > MAX_DATA_ROWS
  const visibleRows = capped ? data.rows.slice(0, CAPPED_VISIBLE_ROWS) : data.rows
  const hiddenCount = data.rows.length - visibleRows.length

  // header + data (+ optional indicator) + total
  const renderedRowCount = visibleRows.length + (capped ? 1 : 0) + 2
  const rowH = Math.min(ROW_H_MAX, Math.max(ROW_H_MIN, theme.layout.contentH / renderedRowCount))
  const fontSize = rowH >= 0.36 ? theme.typography.table.size : rowH >= 0.3 ? 10 : 9

  // Cent-exact AND display-consistent money: the unit price is rounded to
  // cents BEFORE multiplying, so the visible arithmetic always checks out
  // (qty × displayed unit price = displayed subtotal), and the total sums the
  // rounded line totals so it equals the sum of the displayed subtotals.
  const lineTotal = (r: PricingRow) =>
    roundCents((parseFloat(r.quantity) || 0) * roundCents(parseFloat(r.unitPrice) || 0))
  const total = roundCents(data.rows.reduce((sum, r) => sum + lineTotal(r), 0))

  const headerRow: PptxGenJS.TableRow = COLUMN_HEADERS.map((text, i) => ({
    text,
    options: {
      bold: true,
      color: theme.colors.primary.textStrong,
      fill: { color: theme.colors.primary.backgroundStrong },
      fontFace: theme.fonts.heading,
      align: i === 2 ? ('center' as const) : i > 2 ? ('right' as const) : ('left' as const),
    },
  }))

  const dataRows: PptxGenJS.TableRow[] = visibleRows.map((r, idx) => {
    const qty = parseFloat(r.quantity) || 0
    const price = roundCents(parseFloat(r.unitPrice) || 0)
    const bg = idx % 2 === 0 ? theme.colors.neutral.background : theme.colors.neutral.backgroundWeak
    const bodyCell = { fill: { color: bg }, fontFace: theme.fonts.body }
    return [
      { text: truncate(r.serviceName, MAX_CELL_LENGTH), options: bodyCell },
      { text: truncate(r.configuration, MAX_CELL_LENGTH), options: bodyCell },
      { text: String(qty), options: { ...bodyCell, align: 'center' as const } },
      { text: formatEur(price), options: { ...bodyCell, align: 'right' as const } },
      { text: formatEur(lineTotal(r)), options: { ...bodyCell, align: 'right' as const } },
    ]
  })

  if (capped) {
    dataRows.push([
      {
        text: `+ ${hiddenCount} more service line${hiddenCount > 1 ? 's' : ''} — included in the total below`,
        options: {
          colspan: 5,
          italic: true,
          color: theme.colors.neutral.textWeak,
          fill: { color: theme.colors.neutral.backgroundWeak },
          fontFace: theme.fonts.body,
        },
      },
    ])
  }

  const totalCell = {
    bold: true,
    color: theme.colors.neutral.textStrongOnDark,
    fill: { color: theme.colors.neutral.backgroundStronger },
    fontFace: theme.fonts.heading,
  }
  const totalRow: PptxGenJS.TableRow = [
    { text: 'Total Estimated Monthly Cost', options: { ...totalCell, colspan: 4 } },
    { text: formatEur(total), options: { ...totalCell, align: 'right' } },
  ]

  slide.addTable([headerRow, ...dataRows, totalRow], {
    x: tableX,
    y: tableY,
    w: tableW,
    colW: computeColumnWidths(visibleRows, tableW),
    fontSize,
    border: { type: 'solid', color: theme.colors.neutral.border, pt: 0.5 },
    rowH,
    margin: [3, 6, 3, 6],
    valign: 'middle',
    autoPage: false,
  })
}

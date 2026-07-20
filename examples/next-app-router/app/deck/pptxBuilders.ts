'use client'

/**
 * Composable slide-builder functions for pptxgenjs.
 * Each function accepts `(pptx, data)` and appends exactly one slide.
 * Add new slide types here without touching other builders or the main generator.
 *
 * IMPORTANT: Uses pptx.write({ outputType: 'blob' }) — no Node fs access.
 */

import type PptxGenJS from 'pptxgenjs'
import { COLORS, FONTS, PPTX_TEXT, SLIDE } from './themeConstants'
import type { DeckFormState, PricingRow, UsageDataPoint } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a number as French-locale EUR currency, e.g. "1 234,56 €" */
function formatEur(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Slide background — dark navy cover vs white content */
function setDarkBackground(slide: PptxGenJS.Slide) {
  slide.background = { color: COLORS.neutralBackgroundStronger }
}

function setLightBackground(slide: PptxGenJS.Slide) {
  slide.background = { color: COLORS.neutralBackground }
}

/** Reusable purple header bar across the top of a content slide */
function addSlideHeader(slide: PptxGenJS.Slide, title: string) {
  // Accent bar
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE.width,
    h: 0.65,
    fill: { color: COLORS.primaryBackgroundStrong },
  })
  slide.addText(title, {
    x: SLIDE.margin,
    y: 0.08,
    w: SLIDE.width - SLIDE.margin * 2,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: PPTX_TEXT.whiteColor,
    fontFace: FONTS.headings,
  })
}

/** Scaleway-branded footer bar at the bottom of every slide */
function addFooter(slide: PptxGenJS.Slide, date: string) {
  slide.addShape('rect', {
    x: 0,
    y: SLIDE.height - 0.3,
    w: SLIDE.width,
    h: 0.3,
    fill: { color: COLORS.primaryBackgroundStrong },
  })
  slide.addText(`Scaleway  ·  ${date}`, {
    x: SLIDE.margin,
    y: SLIDE.height - 0.28,
    w: SLIDE.width - SLIDE.margin * 2,
    h: 0.25,
    fontSize: 8,
    color: PPTX_TEXT.whiteColor,
    fontFace: FONTS.body,
    align: 'right',
  })
}

// ---------------------------------------------------------------------------
// Slide Builders
// ---------------------------------------------------------------------------

/**
 * Cover slide — always the first slide.
 * Dark navy background with white text and the Scaleway purple accent strip.
 */
export function buildCoverSlide(
  pptx: PptxGenJS,
  data: { title: string; subtitle: string; clientName: string; date: string; deckType: string },
) {
  const slide = pptx.addSlide()
  setDarkBackground(slide)

  // Top accent strip
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: SLIDE.width,
    h: 0.08,
    fill: { color: COLORS.primaryBackgroundStrong },
  })

  // Bottom accent strip
  slide.addShape('rect', {
    x: 0,
    y: SLIDE.height - 0.08,
    w: SLIDE.width,
    h: 0.08,
    fill: { color: COLORS.primaryBackgroundStrong },
  })

  // Left purple sidebar
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 0.08,
    h: SLIDE.height,
    fill: { color: COLORS.primaryBackgroundStrong },
  })

  // Deck type label
  slide.addText(data.deckType.toUpperCase(), {
    x: SLIDE.margin,
    y: 1.8,
    w: 6,
    h: 0.4,
    fontSize: 10,
    color: COLORS.primaryBackgroundStrong,
    fontFace: FONTS.body,
    bold: true,
  })

  // Main title
  slide.addText(data.title, {
    x: SLIDE.margin,
    y: 2.2,
    w: 9,
    h: 1.4,
    fontSize: 36,
    bold: true,
    color: PPTX_TEXT.whiteColor,
    fontFace: FONTS.headings,
    wrap: true,
  })

  // Subtitle / project description
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: SLIDE.margin,
      y: 3.65,
      w: 9,
      h: 0.5,
      fontSize: 16,
      color: COLORS.primaryBackgroundHover,
      fontFace: FONTS.body,
    })
  }

  // Divider
  slide.addShape('line', {
    x: SLIDE.margin,
    y: 4.3,
    w: 5,
    h: 0,
    line: { color: COLORS.primaryBackgroundStrong, width: 1 },
  })

  // Client name
  slide.addText(`Prepared for: ${data.clientName}`, {
    x: SLIDE.margin,
    y: 4.5,
    w: 8,
    h: 0.35,
    fontSize: 12,
    color: PPTX_TEXT.whiteColor,
    fontFace: FONTS.body,
  })

  // Date
  slide.addText(data.date, {
    x: SLIDE.margin,
    y: 4.85,
    w: 8,
    h: 0.3,
    fontSize: 11,
    color: COLORS.neutralBorderStrong,
    fontFace: FONTS.body,
  })
}

/**
 * Hyperscaler Risks slide — 3-column layout for a client proposal.
 * Columns: Economic Risk | Risk to Innovation | Legal & Sovereignty
 */
export function buildRisksSlide(pptx: PptxGenJS, data: { date: string }) {
  const slide = pptx.addSlide()
  setLightBackground(slide)
  addSlideHeader(slide, 'Hyperscaler Risks')
  addFooter(slide, data.date)

  const colW = (SLIDE.width - SLIDE.margin * 2 - 0.4) / 3
  const colY = 0.9
  const colH = SLIDE.height - colY - 0.5

  const columns: Array<{ title: string; points: string[] }> = [
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

  columns.forEach((col, i) => {
    const x = SLIDE.margin + i * (colW + 0.2)

    // Column header box
    slide.addShape('rect', {
      x,
      y: colY,
      w: colW,
      h: 0.5,
      fill: { color: COLORS.primaryBackground },
      line: { color: COLORS.primaryBorder, width: 1 },
    })
    slide.addText(col.title, {
      x,
      y: colY,
      w: colW,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: PPTX_TEXT.primaryColor,
      fontFace: FONTS.headings,
      align: 'center',
      valign: 'middle',
    })

    // Column body
    slide.addShape('rect', {
      x,
      y: colY + 0.5,
      w: colW,
      h: colH - 0.5,
      fill: { color: COLORS.neutralBackgroundWeak },
      line: { color: COLORS.neutralBorder, width: 1 },
    })

    // Bullet points
    const bullets = col.points.map((p) => ({
      text: p,
      options: { bullet: { type: 'bullet' as const }, breakLine: true },
    }))
    slide.addText(bullets, {
      x: x + 0.12,
      y: colY + 0.65,
      w: colW - 0.24,
      h: colH - 0.8,
      fontSize: 10,
      color: PPTX_TEXT.bodyColor,
      fontFace: FONTS.body,
      valign: 'top',
    })
  })
}

/**
 * Investment Summary (Pricing) slide — table with a purple header row,
 * alternating light-gray / white rows, and a bold total row at the bottom.
 */
export function buildPricingSlide(
  pptx: PptxGenJS,
  data: { rows: PricingRow[]; date: string },
) {
  const slide = pptx.addSlide()
  setLightBackground(slide)
  addSlideHeader(slide, 'Investment Summary')
  addFooter(slide, data.date)

  const total = data.rows.reduce((sum, r) => {
    const qty = parseFloat(r.quantity) || 0
    const price = parseFloat(r.unitPrice) || 0
    return sum + qty * price
  }, 0)

  // Build table rows
  const headerRow: PptxGenJS.TableRow = [
    { text: 'Service', options: { bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.primaryBackgroundStrong }, fontFace: FONTS.headings } },
    { text: 'Configuration', options: { bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.primaryBackgroundStrong }, fontFace: FONTS.headings } },
    { text: 'Qty', options: { bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.primaryBackgroundStrong }, fontFace: FONTS.headings, align: 'center' } },
    { text: 'Unit Price', options: { bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.primaryBackgroundStrong }, fontFace: FONTS.headings, align: 'right' } },
    { text: 'Subtotal', options: { bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.primaryBackgroundStrong }, fontFace: FONTS.headings, align: 'right' } },
  ]

  const dataRows: PptxGenJS.TableRow[] = data.rows.map((r, idx) => {
    const qty = parseFloat(r.quantity) || 0
    const price = parseFloat(r.unitPrice) || 0
    const subtotal = qty * price
    const bg = idx % 2 === 0 ? COLORS.neutralBackground : COLORS.neutralBackgroundWeak
    return [
      { text: r.serviceName, options: { fill: { color: bg }, fontFace: FONTS.body } },
      { text: r.configuration, options: { fill: { color: bg }, fontFace: FONTS.body } },
      { text: String(qty), options: { fill: { color: bg }, fontFace: FONTS.body, align: 'center' } },
      { text: formatEur(price), options: { fill: { color: bg }, fontFace: FONTS.body, align: 'right' } },
      { text: formatEur(subtotal), options: { fill: { color: bg }, fontFace: FONTS.body, align: 'right' } },
    ]
  })

  const totalRow: PptxGenJS.TableRow = [
    { text: 'Total Estimated Monthly Cost', options: { colspan: 4, bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.neutralBackgroundStronger }, fontFace: FONTS.headings } },
    { text: formatEur(total), options: { bold: true, color: PPTX_TEXT.whiteColor, fill: { color: COLORS.neutralBackgroundStronger }, fontFace: FONTS.headings, align: 'right' } },
  ]

  slide.addTable([headerRow, ...dataRows, totalRow], {
    x: SLIDE.margin,
    y: 0.85,
    w: SLIDE.width - SLIDE.margin * 2,
    colW: [3.2, 3.0, 0.8, 1.4, 1.4],
    fontSize: 11,
    border: { type: 'solid', color: COLORS.neutralBorder, pt: 0.5 },
    rowH: 0.38,
  })
}

/**
 * Usage & Consumption Overview slide — native pptxgenjs bar chart.
 */
export function buildUsageChartSlide(
  pptx: PptxGenJS,
  data: { dataPoints: UsageDataPoint[]; date: string },
) {
  const slide = pptx.addSlide()
  setLightBackground(slide)
  addSlideHeader(slide, 'Usage & Consumption Overview')
  addFooter(slide, data.date)

  // Group data points by metric label for multi-series chart
  const seriesMap = new Map<string, { month: string; value: number }[]>()
  for (const dp of data.dataPoints) {
    if (!seriesMap.has(dp.metricLabel)) {
      seriesMap.set(dp.metricLabel, [])
    }
    seriesMap.get(dp.metricLabel)!.push({
      month: dp.month,
      value: parseFloat(dp.value) || 0,
    })
  }

  // Use all unique months as category labels
  const allMonths = [...new Set(data.dataPoints.map((dp) => dp.month))]

  const seriesColors = [
    COLORS.primaryBackgroundStrong,
    COLORS.infoBackgroundStrong,
    COLORS.successBackgroundStrong,
    COLORS.dangerBackgroundStrong,
  ]

  const chartData = [...seriesMap.entries()].map(([label, points], i) => {
    const valueMap = new Map(points.map((p) => [p.month, p.value]))
    return {
      name: label,
      labels: allMonths,
      values: allMonths.map((m) => valueMap.get(m) ?? 0),
    }
  })

  if (chartData.length > 0) {
    slide.addChart('bar', chartData, {
      x: SLIDE.margin,
      y: 0.85,
      w: SLIDE.width - SLIDE.margin * 2,
      h: SLIDE.height - 1.5,
      chartColors: seriesColors.slice(0, chartData.length),
      showLegend: true,
      legendPos: 'b',
      catAxisLabelFontFace: FONTS.body,
      valAxisLabelFontFace: FONTS.body,
      dataLabelFontFace: FONTS.body,
      legendFontFace: FONTS.body,
      titleFontFace: FONTS.headings,
    })
  } else {
    slide.addText('No usage data available.', {
      x: SLIDE.margin,
      y: 2,
      w: SLIDE.width - SLIDE.margin * 2,
      h: 1,
      fontSize: 14,
      color: PPTX_TEXT.mutedColor,
      fontFace: FONTS.body,
      align: 'center',
    })
  }
}

/**
 * Roadmap / Next Steps slide — simple bulleted list.
 */
export function buildRoadmapSlide(
  pptx: PptxGenJS,
  data: { items: string[]; date: string },
) {
  const slide = pptx.addSlide()
  setLightBackground(slide)
  addSlideHeader(slide, 'Roadmap / Next Steps')
  addFooter(slide, data.date)

  const bullets = data.items
    .filter((item) => item.trim().length > 0)
    .map((item, idx) => ({
      text: item,
      options: {
        bullet: { code: '2714', color: COLORS.primaryBackgroundStrong },
        paraSpaceAfter: 8,
        indentLevel: 0,
        breakLine: true,
      },
    }))

  if (bullets.length > 0) {
    slide.addText(bullets, {
      x: SLIDE.margin,
      y: 0.9,
      w: SLIDE.width - SLIDE.margin * 2,
      h: SLIDE.height - 1.5,
      fontSize: 14,
      color: PPTX_TEXT.bodyColor,
      fontFace: FONTS.body,
      valign: 'top',
    })
  } else {
    slide.addText('No roadmap items defined.', {
      x: SLIDE.margin,
      y: 2,
      w: SLIDE.width - SLIDE.margin * 2,
      h: 1,
      fontSize: 14,
      color: PPTX_TEXT.mutedColor,
      fontFace: FONTS.body,
      align: 'center',
    })
  }
}

// ---------------------------------------------------------------------------
// Top-level generator
// ---------------------------------------------------------------------------

/**
 * Reads the form state, calls only the relevant slide builders in logical order,
 * and triggers a browser download of the generated .pptx file.
 */
export async function generateDeck(state: DeckFormState): Promise<void> {
  // Dynamic import keeps pptxgenjs out of the SSR bundle
  const PptxGenJS = (await import('pptxgenjs')).default
  const pptx = new PptxGenJS()

  pptx.layout = 'LAYOUT_WIDE' // 16:9

  const formattedDate = state.date
    ? new Date(state.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date non définie'

  const deckTypeLabel =
    state.deckType === 'proposal' ? 'Client Proposal' : 'Internal QBR'

  // 1. Cover slide — always first
  buildCoverSlide(pptx, {
    title: state.projectTitle || 'Untitled Presentation',
    subtitle: deckTypeLabel,
    clientName: state.clientName || 'Valued Client',
    date: formattedDate,
    deckType: deckTypeLabel,
  })

  // 2. Proposal slides (in logical order)
  if (state.deckType === 'proposal') {
    if (state.slides.hyperscalerRisks) {
      buildRisksSlide(pptx, { date: formattedDate })
    }
    if (state.slides.investmentSummary) {
      buildPricingSlide(pptx, { rows: state.pricingRows, date: formattedDate })
    }
  }

  // 3. QBR slides
  if (state.deckType === 'qbr') {
    if (state.slides.usageConsumption) {
      buildUsageChartSlide(pptx, {
        dataPoints: state.usageDataPoints,
        date: formattedDate,
      })
    }
    if (state.slides.roadmapNextSteps) {
      buildRoadmapSlide(pptx, { items: state.roadmapItems, date: formattedDate })
    }
  }

  // Build filename: Scaleway_{DeckType}_{ClientName}_{YYYY-MM-DD}.pptx
  const safeName = (state.clientName || 'Client').replace(/[^a-z0-9]/gi, '_')
  const safeType = state.deckType === 'proposal' ? 'ClientProposal' : 'InternalQBR'
  const fileName = `Scaleway_${safeType}_${safeName}_${state.date || 'undated'}`

  // Trigger browser download — no Node fs
  await pptx.writeFile({ fileName })
}

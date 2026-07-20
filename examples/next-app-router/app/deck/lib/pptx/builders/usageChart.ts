/**
 * Usage & Consumption Overview slide — native pptxgenjs chart.
 * A single metric tracked across >=3 periods renders as a line (trend);
 * anything else renders as grouped bars (comparison).
 *
 * Edge-case behaviour (explicit):
 *   - 0 points -> uniform empty-state placeholder
 *   - 1 category -> bar chart with a wide gap so the lone bar doesn't
 *     fill the plot area edge to edge
 *   - value axis is pinned to 0 so bar proportions are never misleading
 *   - series beyond the 6-color Ultraviolet data-viz palette cycle colors
 */

import type PptxGenJS from 'pptxgenjs'
import type { UsageDataPoint } from '../../../types'
import { addEmptyState, addFooter, addSlideHeader, setLightBackground } from '../chrome'
import { truncate } from '../format'
import type { PptxTheme } from '../theme'

export interface UsageChartSlideData {
  dataPoints: UsageDataPoint[]
  date: string
}

const MAX_LABEL_CHARS = 40

export function buildUsageChartSlide(pptx: PptxGenJS, data: UsageChartSlideData, theme: PptxTheme) {
  const slide = pptx.addSlide()
  setLightBackground(slide, theme)
  addSlideHeader(slide, 'Usage & Consumption Overview', theme)
  addFooter(slide, data.date, theme)

  if (data.dataPoints.length === 0) {
    addEmptyState(slide, 'No usage data available.', theme)
    return
  }

  // Group data points by metric label for a multi-series chart
  const seriesMap = new Map<string, Map<string, number>>()
  for (const dp of data.dataPoints) {
    const label = truncate(dp.metricLabel, MAX_LABEL_CHARS)
    if (!seriesMap.has(label)) {
      seriesMap.set(label, new Map())
    }
    seriesMap.get(label)!.set(dp.month, parseFloat(dp.value) || 0)
  }

  // Preserve first-seen month order rather than re-sorting alphabetically
  const allMonths = [...new Set(data.dataPoints.map(dp => dp.month))]

  const palette = [
    theme.colors.chart.data1,
    theme.colors.chart.data2,
    theme.colors.chart.data3,
    theme.colors.chart.data4,
    theme.colors.chart.data5,
    theme.colors.chart.data6,
  ]

  const chartData = [...seriesMap.entries()].map(([label, valueMap]) => ({
    name: label,
    labels: allMonths,
    values: allMonths.map(m => valueMap.get(m) ?? 0),
  }))
  const seriesColors = chartData.map((_, i) => palette[i % palette.length])

  // A trend line only makes sense with >=3 points on the timeline; several
  // metrics over few periods read better as grouped bars.
  const chartType: 'line' | 'bar' = allMonths.length >= 3 && chartData.length <= 2 ? 'line' : 'bar'

  // With very few categories a default-width bar dominates the plot area;
  // widen the gap so proportions stay reasonable.
  const barGapWidthPct = allMonths.length === 1 ? 250 : allMonths.length === 2 ? 120 : 40

  const axisLabel = theme.typography.bodySmall
  const axisTitle = theme.typography.bodySmall

  slide.addChart(chartType, chartData, {
    x: theme.slide.margin,
    y: theme.layout.contentTop,
    w: theme.slide.width - theme.slide.margin * 2,
    h: theme.layout.contentH,
    chartColors: seriesColors,
    showLegend: chartData.length > 1,
    legendPos: 'b',
    legendFontFace: theme.fonts.body,
    legendFontSize: axisLabel.size,
    legendColor: theme.colors.neutral.text,
    showTitle: false,
    valAxisMinVal: 0,
    catAxisLabelFontFace: theme.fonts.body,
    catAxisLabelFontSize: axisLabel.size,
    catAxisLabelColor: theme.colors.neutral.text,
    showCatAxisTitle: true,
    catAxisTitle: 'Month',
    catAxisTitleFontFace: theme.fonts.heading,
    catAxisTitleFontSize: axisTitle.size,
    catAxisTitleColor: theme.colors.neutral.textStrong,
    valAxisLabelFontFace: theme.fonts.body,
    valAxisLabelFontSize: axisLabel.size,
    valAxisLabelColor: theme.colors.neutral.text,
    showValAxisTitle: true,
    valAxisTitle: 'Usage',
    valAxisTitleFontFace: theme.fonts.heading,
    valAxisTitleFontSize: axisTitle.size,
    valAxisTitleColor: theme.colors.neutral.textStrong,
    ...(chartType === 'line' ? { lineDataSymbol: 'circle', lineSize: 2 } : { barGapWidthPct }),
  })
}

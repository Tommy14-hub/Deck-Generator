/**
 * Usage & Consumption Overview slide — native pptxgenjs chart.
 * Chooses a line chart when a single metric is tracked across several
 * months (a trend), and falls back to a grouped bar chart when comparing
 * multiple metrics side-by-side, which reads better for few categories.
 */

import type PptxGenJS from 'pptxgenjs'
import { addFooter, addSlideHeader, setLightBackground } from '../chrome'
import type { PptxTheme } from '../theme'
import type { UsageDataPoint } from '../../../types'

export interface UsageChartSlideData {
  dataPoints: UsageDataPoint[]
  date: string
}

export function buildUsageChartSlide(
  pptx: PptxGenJS,
  data: UsageChartSlideData,
  theme: PptxTheme,
) {
  const slide = pptx.addSlide()
  setLightBackground(slide, theme)
  addSlideHeader(slide, 'Usage & Consumption Overview', theme)
  addFooter(slide, data.date, theme)

  const chartX = theme.slide.margin
  const chartY = 0.85
  const chartW = theme.slide.width - theme.slide.margin * 2
  const chartH = theme.slide.height - 1.5

  if (data.dataPoints.length === 0) {
    slide.addText('No usage data available.', {
      x: chartX,
      y: 2,
      w: chartW,
      h: 1,
      fontSize: 14,
      color: theme.colors.neutral.textWeak,
      fontFace: theme.fonts.body,
      align: 'center',
    })
    return
  }

  // Group data points by metric label for a multi-series chart
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

  // Preserve first-seen month order rather than re-sorting alphabetically
  const allMonths = [...new Set(data.dataPoints.map((dp) => dp.month))]

  const seriesColors = [
    theme.colors.chart.data1,
    theme.colors.chart.data2,
    theme.colors.chart.data3,
    theme.colors.chart.data4,
    theme.colors.chart.data5,
    theme.colors.chart.data6,
  ]

  const chartData = [...seriesMap.entries()].map(([label, points]) => {
    const valueMap = new Map(points.map((p) => [p.month, p.value]))
    return {
      name: label,
      labels: allMonths,
      values: allMonths.map((m) => valueMap.get(m) ?? 0),
    }
  })

  // A trend line only makes sense with >=3 points on the timeline; a single
  // metric tracked over time reads as a trend, several metrics read better
  // as grouped bars for direct comparison.
  const chartType: 'line' | 'bar' =
    allMonths.length >= 3 && chartData.length <= 2 ? 'line' : 'bar'

  slide.addChart(chartType, chartData, {
    x: chartX,
    y: chartY,
    w: chartW,
    h: chartH,
    chartColors: seriesColors.slice(0, chartData.length),
    showLegend: chartData.length > 1,
    legendPos: 'b',
    legendFontFace: theme.fonts.body,
    legendColor: theme.colors.neutral.text,
    showTitle: false,
    catAxisLabelFontFace: theme.fonts.body,
    catAxisLabelColor: theme.colors.neutral.text,
    showCatAxisTitle: true,
    catAxisTitle: 'Month',
    catAxisTitleFontFace: theme.fonts.heading,
    catAxisTitleColor: theme.colors.neutral.textStrong,
    valAxisLabelFontFace: theme.fonts.body,
    valAxisLabelColor: theme.colors.neutral.text,
    showValAxisTitle: true,
    valAxisTitle: 'Usage',
    valAxisTitleFontFace: theme.fonts.heading,
    valAxisTitleColor: theme.colors.neutral.textStrong,
    dataLabelFontFace: theme.fonts.body,
    ...(chartType === 'line'
      ? { lineDataSymbol: 'circle', lineSize: 2 }
      : { barGapWidthPct: 35 }),
  })
}

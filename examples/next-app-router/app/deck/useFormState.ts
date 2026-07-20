'use client'

/**
 * Central hook that owns all mutable form state for the Deck Generator.
 * Exported as a plain hook; wrap in a Context if multiple components need access.
 */

import { useCallback, useState } from 'react'
import type { DeckFormState, DeckType, PricingRow, SlideToggles, UsageDataPoint } from './types'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

/** Sensible default toggles per deck type */
function defaultToggles(deckType: DeckType): SlideToggles {
  if (deckType === 'proposal') {
    return {
      hyperscalerRisks: true,
      investmentSummary: true,
      usageConsumption: false,
      roadmapNextSteps: false,
    }
  }
  return {
    hyperscalerRisks: false,
    investmentSummary: false,
    usageConsumption: true,
    roadmapNextSteps: true,
  }
}

function makeSamplePricingRows(): PricingRow[] {
  return [
    {
      id: generateId(),
      serviceName: 'Instances (DEV1-M)',
      configuration: '2 vCPU, 4 GB RAM',
      quantity: '5',
      unitPrice: '13.99',
    },
    {
      id: generateId(),
      serviceName: 'Managed Database (DB-DEV1-S)',
      configuration: 'PostgreSQL, 20 GB SSD',
      quantity: '2',
      unitPrice: '29.99',
    },
    {
      id: generateId(),
      serviceName: 'Object Storage',
      configuration: '500 GB / month',
      quantity: '1',
      unitPrice: '11.75',
    },
  ]
}

function makeSampleUsagePoints(): UsageDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.flatMap(month => [
    {
      id: generateId(),
      month,
      metricLabel: 'Compute (vCPU-h)',
      value: String(Math.floor(Math.random() * 3000 + 4000)),
    },
    { id: generateId(), month, metricLabel: 'Storage (GB)', value: String(Math.floor(Math.random() * 200 + 300)) },
  ])
}

const INITIAL_DECK_TYPE: DeckType = 'proposal'

const INITIAL_STATE: DeckFormState = {
  clientName: '',
  projectTitle: '',
  date: new Date().toISOString().split('T')[0],
  deckType: INITIAL_DECK_TYPE,
  slides: defaultToggles(INITIAL_DECK_TYPE),
  pricingRows: makeSamplePricingRows(),
  usageDataPoints: makeSampleUsagePoints(),
  roadmapItems: [
    'Kick-off workshop and architecture review',
    'Deploy proof-of-concept environment',
    'Security & compliance audit',
    'Full migration and go-live',
  ],
}

export function useFormState() {
  const [state, setState] = useState<DeckFormState>(INITIAL_STATE)

  // ---- General Info ----
  const setClientName = useCallback((v: string) => setState(s => ({ ...s, clientName: v })), [])
  const setProjectTitle = useCallback((v: string) => setState(s => ({ ...s, projectTitle: v })), [])
  const setDate = useCallback((v: string) => setState(s => ({ ...s, date: v })), [])
  const setDeckType = useCallback((v: DeckType) => {
    setState(s => ({ ...s, deckType: v, slides: defaultToggles(v) }))
  }, [])

  // ---- Slide toggles ----
  const setSlideToggle = useCallback((key: keyof SlideToggles, value: boolean) => {
    setState(s => ({ ...s, slides: { ...s.slides, [key]: value } }))
  }, [])

  // ---- Pricing rows ----
  const addPricingRow = useCallback(() => {
    setState(s => ({
      ...s,
      pricingRows: [
        ...s.pricingRows,
        { id: generateId(), serviceName: '', configuration: '', quantity: '1', unitPrice: '0' },
      ],
    }))
  }, [])

  const updatePricingRow = useCallback((id: string, field: keyof Omit<PricingRow, 'id'>, value: string) => {
    setState(s => ({
      ...s,
      pricingRows: s.pricingRows.map(r => (r.id === id ? { ...r, [field]: value } : r)),
    }))
  }, [])

  const removePricingRow = useCallback((id: string) => {
    setState(s => ({ ...s, pricingRows: s.pricingRows.filter(r => r.id !== id) }))
  }, [])

  // ---- Usage data points ----
  const addUsagePoint = useCallback(() => {
    setState(s => ({
      ...s,
      usageDataPoints: [...s.usageDataPoints, { id: generateId(), month: '', metricLabel: '', value: '0' }],
    }))
  }, [])

  const updateUsagePoint = useCallback((id: string, field: keyof Omit<UsageDataPoint, 'id'>, value: string) => {
    setState(s => ({
      ...s,
      usageDataPoints: s.usageDataPoints.map(dp => (dp.id === id ? { ...dp, [field]: value } : dp)),
    }))
  }, [])

  const removeUsagePoint = useCallback((id: string) => {
    setState(s => ({ ...s, usageDataPoints: s.usageDataPoints.filter(dp => dp.id !== id) }))
  }, [])

  // ---- Roadmap items ----
  const updateRoadmapItem = useCallback((idx: number, value: string) => {
    setState(s => {
      const items = [...s.roadmapItems]
      items[idx] = value
      return { ...s, roadmapItems: items }
    })
  }, [])

  const addRoadmapItem = useCallback(() => {
    setState(s => ({ ...s, roadmapItems: [...s.roadmapItems, ''] }))
  }, [])

  const removeRoadmapItem = useCallback((idx: number) => {
    setState(s => ({ ...s, roadmapItems: s.roadmapItems.filter((_, i) => i !== idx) }))
  }, [])

  return {
    state,
    setClientName,
    setProjectTitle,
    setDate,
    setDeckType,
    setSlideToggle,
    addPricingRow,
    updatePricingRow,
    removePricingRow,
    addUsagePoint,
    updateUsagePoint,
    removeUsagePoint,
    updateRoadmapItem,
    addRoadmapItem,
    removeRoadmapItem,
  }
}

export type FormStateActions = ReturnType<typeof useFormState>

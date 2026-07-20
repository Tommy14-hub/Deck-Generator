/**
 * Core types for the Scaleway Presentation Deck Generator.
 * All form state is managed client-side — no backend for v1.
 */

export type DeckType = 'proposal' | 'qbr'

/** A single row in the Pricing / Investment Summary table */
export interface PricingRow {
  id: string
  serviceName: string
  configuration: string
  quantity: string // stored as string for controlled input; validated on generate
  unitPrice: string // stored as string; numeric in EUR
}

/** A single data point for the Usage Chart (QBR) */
export interface UsageDataPoint {
  id: string
  month: string
  metricLabel: string
  value: string // stored as string; validated on generate
}

/**
 * Which slides are toggled on/off.
 * Each field maps to one slide builder function.
 */
export interface SlideToggles {
  /** Proposal-specific */
  hyperscalerRisks: boolean
  investmentSummary: boolean
  /** QBR-specific */
  usageConsumption: boolean
  roadmapNextSteps: boolean
}

/** Complete form state passed to generateDeck() */
export interface DeckFormState {
  // ---- General Info ----
  clientName: string
  projectTitle: string
  date: string // ISO date string YYYY-MM-DD
  deckType: DeckType

  // ---- Slide toggles ----
  slides: SlideToggles

  // ---- Pricing data (Investment Summary slide) ----
  pricingRows: PricingRow[]

  // ---- Usage data (QBR chart slide) ----
  usageDataPoints: UsageDataPoint[]

  // ---- Roadmap bullet points (QBR) ----
  roadmapItems: string[]
}

/** Validation errors returned before allowing generation */
export interface ValidationErrors {
  clientName?: string
  projectTitle?: string
  date?: string
  pricing?: string
  usage?: string
  roadmap?: string
}

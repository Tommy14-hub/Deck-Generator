'use client'

/**
 * Top-level PPTX generator. Reads the deck type + toggles from form state
 * and calls only the relevant slide builders, in a fixed order (cover
 * always first), then triggers a browser download of the result.
 *
 * IMPORTANT: Uses pptx.write({ outputType: 'blob' }) — no Node fs access.
 */

import {
  buildCoverSlide,
  buildPricingSlide,
  buildRisksSlide,
  buildRoadmapSlide,
  buildUsageChartSlide,
} from './builders'
import { theme as defaultTheme } from './theme'
import type { PptxTheme } from './theme'
import type { DeckFormState } from '../../types'

/**
 * Defensive, generator-level validation. The UI already blocks the "Generate"
 * button on invalid form state (see DeckGenerator's `validate`), but this
 * guards `generateDeck` itself against being called with bad state directly,
 * so it never silently produces a broken or empty file.
 */
function assertValidState(state: DeckFormState): void {
  if (!state.projectTitle?.trim() && !state.clientName?.trim()) {
    throw new Error('Cannot generate a deck without a project title or client name.')
  }

  const anySlideEnabled =
    state.deckType === 'proposal'
      ? state.slides.hyperscalerRisks || state.slides.investmentSummary
      : state.slides.usageConsumption || state.slides.roadmapNextSteps

  if (!anySlideEnabled) {
    throw new Error('At least one content slide must be enabled before generating a deck.')
  }
}

export async function generateDeck(
  state: DeckFormState,
  theme: PptxTheme = defaultTheme,
): Promise<void> {
  assertValidState(state)

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

  const deckTypeLabel = state.deckType === 'proposal' ? 'Client Proposal' : 'Internal QBR'

  // 1. Cover slide — always first
  buildCoverSlide(
    pptx,
    {
      title: state.projectTitle || 'Untitled Presentation',
      subtitle: deckTypeLabel,
      clientName: state.clientName || 'Valued Client',
      date: formattedDate,
      deckType: deckTypeLabel,
    },
    theme,
  )

  // 2. Proposal slides (in logical order)
  if (state.deckType === 'proposal') {
    if (state.slides.hyperscalerRisks) {
      buildRisksSlide(pptx, { date: formattedDate }, theme)
    }
    if (state.slides.investmentSummary) {
      buildPricingSlide(pptx, { rows: state.pricingRows, date: formattedDate }, theme)
    }
  }

  // 3. QBR slides
  if (state.deckType === 'qbr') {
    if (state.slides.usageConsumption) {
      buildUsageChartSlide(pptx, { dataPoints: state.usageDataPoints, date: formattedDate }, theme)
    }
    if (state.slides.roadmapNextSteps) {
      buildRoadmapSlide(pptx, { items: state.roadmapItems, date: formattedDate }, theme)
    }
  }

  // Build filename: Scaleway_{DeckType}_{ClientName}_{YYYY-MM-DD}.pptx
  const safeName = (state.clientName || 'Client').replace(/[^a-z0-9]/gi, '_')
  const safeType = state.deckType === 'proposal' ? 'ClientProposal' : 'InternalQBR'
  const fileName = `Scaleway_${safeType}_${safeName}_${state.date || 'undated'}`

  // Trigger browser download — no Node fs
  await pptx.writeFile({ fileName })
}

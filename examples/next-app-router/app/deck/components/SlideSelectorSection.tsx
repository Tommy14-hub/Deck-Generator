'use client'

import { Badge, Separator, Stack, Text, Toggle } from '@ultraviolet/ui'
import type { DeckType, SlideToggles } from '../types'
import type { FormStateActions } from '../useFormState'

/** Metadata for each slide type */
const SLIDE_DEFS: Array<{
  key: keyof SlideToggles
  label: string
  description: string
  deckTypes: DeckType[]
}> = [
  {
    key: 'hyperscalerRisks',
    label: 'Hyperscaler Risks',
    description: '3-column layout: Economic Risk, Risk to Innovation, Legal & Sovereignty',
    deckTypes: ['proposal'],
  },
  {
    key: 'investmentSummary',
    label: 'Investment Summary',
    description: 'Pricing table with subtotals and total estimated monthly cost',
    deckTypes: ['proposal'],
  },
  {
    key: 'usageConsumption',
    label: 'Usage & Consumption Overview',
    description: 'Bar chart built from your usage data entries',
    deckTypes: ['qbr'],
  },
  {
    key: 'roadmapNextSteps',
    label: 'Roadmap / Next Steps',
    description: 'Bulleted action list for the upcoming period',
    deckTypes: ['qbr'],
  },
]

type Props = {
  deckType: DeckType
  slides: SlideToggles
  setSlideToggle: FormStateActions['setSlideToggle']
}

export function SlideSelectorSection({ deckType, slides, setSlideToggle }: Props) {
  const visibleSlides = SLIDE_DEFS.filter(s => s.deckTypes.includes(deckType))
  const enabledCount = visibleSlides.filter(s => slides[s.key]).length
  // Cover slide is always included
  const totalCount = enabledCount + 1

  return (
    <Stack gap={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Text as="h2" variant="headingSmall">
          Slide Selector
        </Text>
        <Stack direction="row" alignItems="center" gap={1}>
          <Text as="span" variant="bodySmall" prominence="weak">
            Total slides:
          </Text>
          <Badge sentiment="primary" size="small">
            {totalCount}
          </Badge>
        </Stack>
      </Stack>

      {/* Cover slide — always on */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{
          padding: '12px 16px',
          borderRadius: 6,
          border: '1px solid #d9dadd',
          background: '#f9f9fa',
        }}
      >
        <Stack gap={0.5}>
          <Stack direction="row" gap={1} alignItems="center">
            <Text as="span" variant="bodyStrong">
              Cover Slide
            </Text>
            <Badge sentiment="neutral" size="small">
              Always included
            </Badge>
          </Stack>
          <Text as="span" variant="bodySmall" prominence="weak">
            Title, client name, date and deck type
          </Text>
        </Stack>
        <Toggle checked disabled label="Cover" aria-label="Cover slide always included" />
      </Stack>

      <Separator />

      {/* Configurable slides */}
      <Stack gap={2}>
        {visibleSlides.map((slideDef, idx) => (
          <Stack
            key={slideDef.key}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            style={{
              padding: '12px 16px',
              borderRadius: 6,
              border: `1px solid ${slides[slideDef.key] ? '#8c40ef' : '#d9dadd'}`,
              background: slides[slideDef.key] ? '#f1eefc' : '#ffffff',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <Stack gap={0.5}>
              <Stack direction="row" gap={1} alignItems="center">
                <Text as="span" variant="bodyStrong" sentiment={slides[slideDef.key] ? 'primary' : 'neutral'}>
                  {slideDef.label}
                </Text>
                <Badge sentiment="neutral" size="small">
                  Slide {idx + 2}
                </Badge>
              </Stack>
              <Text as="span" variant="bodySmall" prominence="weak">
                {slideDef.description}
              </Text>
            </Stack>
            <Toggle
              checked={slides[slideDef.key]}
              onChange={e => setSlideToggle(slideDef.key, e.target.checked)}
              label={slideDef.label}
              aria-label={`Toggle ${slideDef.label} slide`}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

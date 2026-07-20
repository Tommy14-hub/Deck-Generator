'use client'

import { Separator, Stack, Tabs, Text } from '@ultraviolet/ui'
import { useState } from 'react'
import { generateDeck } from '../pptxBuilders'
import type { ValidationErrors } from '../types'
import { useFormState } from '../useFormState'
import { ExportPanel } from './ExportPanel'
import { GeneralInfoSection } from './GeneralInfoSection'
import { PricingSection } from './PricingSection'
import { SlideSelectorSection } from './SlideSelectorSection'
import { UsageDataSection } from './UsageDataSection'

type ExportStatus = 'idle' | 'generating' | 'success' | 'error'

function validate(state: ReturnType<typeof useFormState>['state']): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!state.clientName.trim()) {
    errors.clientName = 'Client name is required.'
  }
  if (!state.projectTitle.trim()) {
    errors.projectTitle = 'Project title is required.'
  }
  if (!state.date) {
    errors.date = 'Presentation date is required.'
  }

  if (state.deckType === 'proposal' && state.slides.investmentSummary) {
    if (state.pricingRows.length === 0) {
      errors.pricing = 'Investment Summary is enabled but no pricing rows are defined.'
    } else {
      const invalid = state.pricingRows.some((r) => {
        const qty = parseFloat(r.quantity)
        const price = parseFloat(r.unitPrice)
        return isNaN(qty) || qty < 1 || isNaN(price) || price < 0 || !r.serviceName.trim()
      })
      if (invalid) {
        errors.pricing =
          'One or more pricing rows have invalid values. Quantity must be ≥ 1, price must be ≥ 0, and service name is required.'
      }
    }
  }

  if (state.deckType === 'qbr' && state.slides.usageConsumption) {
    if (state.usageDataPoints.length < 3) {
      errors.usage = 'Usage & Consumption slide requires at least 3 data points.'
    }
    const invalid = state.usageDataPoints.some(
      (dp) => !dp.month.trim() || !dp.metricLabel.trim() || isNaN(parseFloat(dp.value)),
    )
    if (invalid) {
      errors.usage = 'One or more usage data points are incomplete. Fill in all fields.'
    }
  }

  return errors
}

export function DeckGenerator() {
  const form = useFormState()
  const { state } = form

  const [status, setStatus] = useState<ExportStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const handleGenerate = async () => {
    const errors = validate(state)
    setValidationErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setStatus('generating')
    setErrorMessage(undefined)

    try {
      await generateDeck(state)
      setStatus('success')
    } catch (err) {
      console.error('[DeckGenerator] generation failed:', err)
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred during generation.',
      )
    }
  }

  const showPricing = state.deckType === 'proposal' && state.slides.investmentSummary
  const showUsage = state.deckType === 'qbr' && state.slides.usageConsumption
  const showRoadmap = state.deckType === 'qbr' && state.slides.roadmapNextSteps

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 24,
        minHeight: '100vh',
        background: '#f9f9fa',
      }}
    >
      {/* ---- Left panel: form ---- */}
      <main
        style={{
          padding: '32px 32px 64px',
          overflowY: 'auto',
        }}
      >
        <Stack gap={5}>
          {/* Page header */}
          <Stack gap={1}>
            <Text
              as="h1"
              variant="heading"
              style={{
                fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              }}
            >
              Scaleway Deck Generator
            </Text>
            <Text as="p" variant="body" prominence="weak">
              Build a client proposal or internal QBR presentation and export it as a PowerPoint
              file.
            </Text>
          </Stack>

          <Separator />

          <Tabs>
            <Tabs.Tab id="general" label="1. General Info">
              <div style={{ paddingTop: 24 }}>
                <GeneralInfoSection
                  clientName={state.clientName}
                  projectTitle={state.projectTitle}
                  date={state.date}
                  deckType={state.deckType}
                  setClientName={form.setClientName}
                  setProjectTitle={form.setProjectTitle}
                  setDate={form.setDate}
                  setDeckType={form.setDeckType}
                />
              </div>
            </Tabs.Tab>

            <Tabs.Tab id="slides" label="2. Slides">
              <div style={{ paddingTop: 24 }}>
                <SlideSelectorSection
                  deckType={state.deckType}
                  slides={state.slides}
                  setSlideToggle={form.setSlideToggle}
                />
              </div>
            </Tabs.Tab>

            {(showPricing || showUsage || showRoadmap) && (
              <Tabs.Tab id="data" label="3. Data">
                <div style={{ paddingTop: 24 }}>
                  <Stack gap={5}>
                    {showPricing && (
                      <PricingSection
                        rows={state.pricingRows}
                        addPricingRow={form.addPricingRow}
                        updatePricingRow={form.updatePricingRow}
                        removePricingRow={form.removePricingRow}
                      />
                    )}
                    {(showUsage || showRoadmap) && (
                      <UsageDataSection
                        dataPoints={state.usageDataPoints}
                        addUsagePoint={form.addUsagePoint}
                        updateUsagePoint={form.updateUsagePoint}
                        removeUsagePoint={form.removeUsagePoint}
                        roadmapItems={state.roadmapItems}
                        updateRoadmapItem={form.updateRoadmapItem}
                        addRoadmapItem={form.addRoadmapItem}
                        removeRoadmapItem={form.removeRoadmapItem}
                        showUsage={showUsage}
                        showRoadmap={showRoadmap}
                      />
                    )}
                  </Stack>
                </div>
              </Tabs.Tab>
            )}
          </Tabs>
        </Stack>
      </main>

      {/* ---- Right panel: export ---- */}
      <aside
        style={{
          padding: '32px 24px',
          borderLeft: '1px solid #d9dadd',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Stack gap={3}>
          <Text
            as="h2"
            variant="headingSmall"
            style={{
              fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            }}
          >
            Export
          </Text>
          <ExportPanel
            state={state}
            status={status}
            errors={validationErrors}
            onGenerate={handleGenerate}
            errorMessage={errorMessage}
          />
        </Stack>
      </aside>
    </div>
  )
}

'use client'

import { Alert, Button, Stack, Text } from '@ultraviolet/ui'
import type { DeckFormState, ValidationErrors } from '../types'

/** Inline download icon (no @ultraviolet/icons dep required) */
function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

type ExportStatus = 'idle' | 'generating' | 'success' | 'error'

type Props = {
  state: DeckFormState
  status: ExportStatus
  errors: ValidationErrors
  onGenerate: () => void
  errorMessage?: string
}

/** Count how many slides will be generated */
function countSlides(state: DeckFormState): number {
  let count = 1 // cover always
  if (state.deckType === 'proposal') {
    if (state.slides.hyperscalerRisks) count++
    if (state.slides.investmentSummary) count++
  } else {
    if (state.slides.usageConsumption) count++
    if (state.slides.roadmapNextSteps) count++
  }
  return count
}

function buildFileName(state: DeckFormState): string {
  const safeName = (state.clientName || 'Client').replace(/[^a-z0-9]/gi, '_')
  const safeType = state.deckType === 'proposal' ? 'ClientProposal' : 'InternalQBR'
  return `Scaleway_${safeType}_${safeName}_${state.date || 'undated'}.pptx`
}

export function ExportPanel({ state, status, errors, onGenerate, errorMessage }: Props) {
  const hasErrors = Object.keys(errors).length > 0
  const isGenerating = status === 'generating'
  const fileName = buildFileName(state)
  const slideCount = countSlides(state)

  return (
    <Stack gap={3}>
      {/* Validation errors */}
      {hasErrors && (
        <Alert sentiment="danger" title="Please fix the following before generating">
          <Stack as="ul" gap={0.5} style={{ paddingLeft: 16, margin: 0, listStyle: 'disc' }}>
            {Object.values(errors).map(err => (
              <Text key={err} as="li" variant="bodySmall">
                {err}
              </Text>
            ))}
          </Stack>
        </Alert>
      )}

      {/* Generation error */}
      {status === 'error' && errorMessage && (
        <Alert sentiment="danger" title="Generation failed">
          {errorMessage}
        </Alert>
      )}

      {/* Success */}
      {status === 'success' && (
        <Alert sentiment="success" title="Deck generated successfully">
          Your file <strong>{fileName}</strong> has been downloaded ({slideCount} slide
          {slideCount !== 1 ? 's' : ''}).
        </Alert>
      )}

      {/* Preview summary */}
      <Stack
        gap={2}
        style={{
          padding: '16px',
          borderRadius: 8,
          border: '1px solid #d9dadd',
          background: '#f9f9fa',
        }}
      >
        <Text as="h3" variant="headingSmall">
          Export Preview
        </Text>

        <Stack gap={1}>
          <SummaryRow label="Client" value={state.clientName || <em>not set</em>} />
          <SummaryRow label="Title" value={state.projectTitle || <em>not set</em>} />
          <SummaryRow label="Date" value={state.date || <em>not set</em>} />
          <SummaryRow label="Type" value={state.deckType === 'proposal' ? 'Client Proposal' : 'Internal QBR'} />
          <SummaryRow label="Slides" value={`${slideCount} slide${slideCount !== 1 ? 's' : ''}`} />
          <SummaryRow label="File" value={<code style={{ fontSize: 11 }}>{fileName}</code>} />
        </Stack>
      </Stack>

      {/* CTA */}
      <Button
        variant="filled"
        sentiment="primary"
        size="large"
        icon={isGenerating ? undefined : <DownloadIcon />}
        iconPosition="left"
        isLoading={isGenerating}
        disabled={isGenerating}
        onClick={onGenerate}
        style={{ width: '100%' }}
      >
        {isGenerating ? 'Generating deck...' : 'Generate .pptx Deck'}
      </Button>
    </Stack>
  )
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" gap={1} alignItems="baseline">
      <Text as="span" variant="bodySmall" prominence="weak" style={{ minWidth: 56 }}>
        {label}:
      </Text>
      <Text as="span" variant="bodySmall">
        {value}
      </Text>
    </Stack>
  )
}

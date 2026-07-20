'use client'

import { SelectInput, Stack, Text, TextInput } from '@ultraviolet/ui'
import type { DeckType } from '../types'
import type { FormStateActions } from '../useFormState'

const DECK_TYPE_OPTIONS: Array<{ label: string; value: DeckType }> = [
  { label: 'Client Proposal', value: 'proposal' },
  { label: 'Internal QBR', value: 'qbr' },
]

type Props = {
  clientName: string
  projectTitle: string
  date: string
  deckType: DeckType
  setClientName: FormStateActions['setClientName']
  setProjectTitle: FormStateActions['setProjectTitle']
  setDate: FormStateActions['setDate']
  setDeckType: FormStateActions['setDeckType']
}

export function GeneralInfoSection({
  clientName,
  projectTitle,
  date,
  deckType,
  setClientName,
  setProjectTitle,
  setDate,
  setDeckType,
}: Props) {
  return (
    <Stack gap={3}>
      <Text as="h2" variant="headingSmall">
        General Information
      </Text>

      <Stack gap={2}>
        <TextInput
          label="Client Name"
          placeholder="Acme Corporation"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          required
          helper="The organisation this deck is prepared for."
        />

        <TextInput
          label="Project Title"
          placeholder="Cloud Migration Strategy 2025"
          value={projectTitle}
          onChange={e => setProjectTitle(e.target.value)}
          required
          helper="Appears as the main title on the cover slide."
        />

        <TextInput
          label="Presentation Date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          helper="Format: YYYY-MM-DD"
        />

        <SelectInput
          label="Deck Type"
          value={deckType}
          onChange={(val: string) => {
            if (val === 'proposal' || val === 'qbr') {
              setDeckType(val as DeckType)
            }
          }}
          options={DECK_TYPE_OPTIONS}
          helper="Controls which slide toggles are available in the next section."
        />
      </Stack>
    </Stack>
  )
}

'use client'

import { Button, EmptyState, NumberInput, Stack, Text, TextInput } from '@ultraviolet/ui'
import type { PricingRow } from '../types'

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
import type { FormStateActions } from '../useFormState'

/** Format a number as French-locale EUR (matches PPTX output) */
function formatEur(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

type Props = {
  rows: PricingRow[]
  addPricingRow: FormStateActions['addPricingRow']
  updatePricingRow: FormStateActions['updatePricingRow']
  removePricingRow: FormStateActions['removePricingRow']
}

export function PricingSection({ rows, addPricingRow, updatePricingRow, removePricingRow }: Props) {
  const total = rows.reduce((sum, r) => {
    const qty = parseFloat(r.quantity) || 0
    const price = parseFloat(r.unitPrice) || 0
    return sum + qty * price
  }, 0)

  return (
    <Stack gap={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack gap={0.5}>
          <Text as="h2" variant="headingSmall">
            Pricing Data
          </Text>
          <Text as="p" variant="bodySmall" prominence="weak">
            Used in the Investment Summary slide. Prices in EUR.
          </Text>
        </Stack>
        <Button
          variant="outlined"
          sentiment="primary"
          size="small"
          icon={<PlusIcon />}
          iconPosition="left"
          onClick={addPricingRow}
        >
          Add row
        </Button>
      </Stack>

      {rows.length === 0 ? (
        <EmptyState
          title="No pricing rows yet"
          description="Add your first service line to build the Investment Summary slide."
          icon="product"
          action={{
            label: 'Add first line',
            onClick: addPricingRow,
          }}
        />
      ) : (
        <Stack gap={0}>
          {/* Table header */}
          <Stack
            direction="row"
            gap={1}
            style={{
              padding: '8px 12px',
              background: '#8c40ef',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <div style={{ flex: '2 1 0', minWidth: 0 }}>
              <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                Service Name
              </Text>
            </div>
            <div style={{ flex: '2 1 0', minWidth: 0 }}>
              <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                Configuration
              </Text>
            </div>
            <div style={{ flex: '1 0 80px', minWidth: 80 }}>
              <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                Qty
              </Text>
            </div>
            <div style={{ flex: '1 0 110px', minWidth: 110 }}>
              <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                Unit Price (€)
              </Text>
            </div>
            <div style={{ flex: '1 0 110px', minWidth: 110 }}>
              <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                Subtotal
              </Text>
            </div>
            <div style={{ width: 36 }} />
          </Stack>

          {/* Rows */}
          {rows.map((row, idx) => {
            const qty = parseFloat(row.quantity) || 0
            const price = parseFloat(row.unitPrice) || 0
            const subtotal = qty * price
            const isEven = idx % 2 === 0

            return (
              <Stack
                key={row.id}
                direction="row"
                gap={1}
                alignItems="center"
                style={{
                  padding: '8px 12px',
                  background: isEven ? '#ffffff' : '#f9f9fa',
                  borderLeft: '1px solid #d9dadd',
                  borderRight: '1px solid #d9dadd',
                  borderBottom: '1px solid #d9dadd',
                }}
              >
                <div style={{ flex: '2 1 0', minWidth: 0 }}>
                  <TextInput
                    label=""
                    aria-label="Service name"
                    placeholder="e.g. Instance DEV1-M"
                    value={row.serviceName}
                    onChange={(e) => updatePricingRow(row.id, 'serviceName', e.target.value)}
                    size="small"
                  />
                </div>
                <div style={{ flex: '2 1 0', minWidth: 0 }}>
                  <TextInput
                    label=""
                    aria-label="Configuration"
                    placeholder="e.g. 2 vCPU, 4 GB"
                    value={row.configuration}
                    onChange={(e) => updatePricingRow(row.id, 'configuration', e.target.value)}
                    size="small"
                  />
                </div>
                <div style={{ flex: '1 0 80px', minWidth: 80 }}>
                  <NumberInput
                    label=""
                    aria-label="Quantity"
                    value={parseFloat(row.quantity) || 1}
                    min={1}
                    onChange={(val) =>
                      updatePricingRow(row.id, 'quantity', String(val ?? 1))
                    }
                    size="small"
                  />
                </div>
                <div style={{ flex: '1 0 110px', minWidth: 110 }}>
                  <NumberInput
                    label=""
                    aria-label="Unit price"
                    value={parseFloat(row.unitPrice) || 0}
                    min={0}
                    step={0.01}
                    onChange={(val) =>
                      updatePricingRow(row.id, 'unitPrice', String(val ?? 0))
                    }
                    size="small"
                  />
                </div>
                <div style={{ flex: '1 0 110px', minWidth: 110 }}>
                  <Text as="span" variant="bodySmall" style={{ fontWeight: 600 }}>
                    {formatEur(subtotal)}
                  </Text>
                </div>
                <div style={{ width: 36, flexShrink: 0 }}>
                  <Button
                    variant="ghost"
                    sentiment="danger"
                    size="small"
                    icon={<DeleteIcon />}
                    aria-label="Remove row"
                    onClick={() => removePricingRow(row.id)}
                  />
                </div>
              </Stack>
            )
          })}

          {/* Total row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              padding: '10px 12px',
              background: '#151a2d',
              borderRadius: '0 0 6px 6px',
            }}
          >
            <Text as="span" variant="bodyStrong" style={{ color: '#ffffff' }}>
              Total Estimated Monthly Cost
            </Text>
            <Text as="span" variant="bodyStrong" style={{ color: '#ffffff', fontSize: 16 }}>
              {formatEur(total)}
            </Text>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

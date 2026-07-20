'use client'

import { Button, EmptyState, NumberInput, Stack, Text, TextInput } from '@ultraviolet/ui'
import type { UsageDataPoint } from '../types'

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

const MAX_POINTS = 12

type Props = {
  dataPoints: UsageDataPoint[]
  addUsagePoint: FormStateActions['addUsagePoint']
  updateUsagePoint: FormStateActions['updateUsagePoint']
  removeUsagePoint: FormStateActions['removeUsagePoint']
  /** Roadmap items (QBR next steps) */
  roadmapItems: string[]
  updateRoadmapItem: FormStateActions['updateRoadmapItem']
  addRoadmapItem: FormStateActions['addRoadmapItem']
  removeRoadmapItem: FormStateActions['removeRoadmapItem']
  showRoadmap: boolean
  showUsage: boolean
}

export function UsageDataSection({
  dataPoints,
  addUsagePoint,
  updateUsagePoint,
  removeUsagePoint,
  roadmapItems,
  updateRoadmapItem,
  addRoadmapItem,
  removeRoadmapItem,
  showRoadmap,
  showUsage,
}: Props) {
  return (
    <Stack gap={4}>
      {/* ---- Usage Data ---- */}
      {showUsage && (
        <Stack gap={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack gap={0.5}>
              <Text as="h2" variant="headingSmall">
                Usage Data
              </Text>
              <Text as="p" variant="bodySmall" prominence="weak">
                Feeds the bar chart in the Usage &amp; Consumption slide. 3–12 data points.
              </Text>
            </Stack>
            <Button
              variant="outlined"
              sentiment="primary"
              size="small"
              icon={<PlusIcon />}
              iconPosition="left"
              onClick={addUsagePoint}
              disabled={dataPoints.length >= MAX_POINTS}
              tooltip={dataPoints.length >= MAX_POINTS ? `Maximum ${MAX_POINTS} data points` : undefined}
            >
              Add point
            </Button>
          </Stack>

          {dataPoints.length === 0 ? (
            <EmptyState
              title="No usage data yet"
              description="Add at least 3 data points to populate the chart slide."
              icon="database"
              action={{
                label: 'Add first data point',
                onClick: addUsagePoint,
              }}
            />
          ) : (
            <Stack gap={0}>
              {/* Header */}
              <Stack
                direction="row"
                gap={1}
                style={{
                  padding: '8px 12px',
                  background: '#0078d2',
                  borderRadius: '6px 6px 0 0',
                }}
              >
                <div style={{ flex: '1 0 0' }}>
                  <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                    Month
                  </Text>
                </div>
                <div style={{ flex: '2 0 0' }}>
                  <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                    Metric Label
                  </Text>
                </div>
                <div style={{ flex: '1 0 0' }}>
                  <Text as="span" variant="bodySmall" style={{ color: '#fff', fontWeight: 600 }}>
                    Value
                  </Text>
                </div>
                <div style={{ width: 36 }} />
              </Stack>

              {dataPoints.map((dp, idx) => {
                const isEven = idx % 2 === 0
                return (
                  <Stack
                    key={dp.id}
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
                    <div style={{ flex: '1 0 0' }}>
                      <TextInput
                        label=""
                        aria-label="Month"
                        placeholder="Jan"
                        value={dp.month}
                        onChange={(e) => updateUsagePoint(dp.id, 'month', e.target.value)}
                        size="small"
                      />
                    </div>
                    <div style={{ flex: '2 0 0' }}>
                      <TextInput
                        label=""
                        aria-label="Metric label"
                        placeholder="Compute (vCPU-h)"
                        value={dp.metricLabel}
                        onChange={(e) => updateUsagePoint(dp.id, 'metricLabel', e.target.value)}
                        size="small"
                      />
                    </div>
                    <div style={{ flex: '1 0 0' }}>
                      <NumberInput
                        label=""
                        aria-label="Value"
                        value={parseFloat(dp.value) || 0}
                        min={0}
                        onChange={(val) =>
                          updateUsagePoint(dp.id, 'value', String(val ?? 0))
                        }
                        size="small"
                      />
                    </div>
                    <div style={{ width: 36, flexShrink: 0 }}>
                      <Button
                        variant="ghost"
                        sentiment="danger"
                        size="small"
                        icon={<DeleteIcon />}
                        aria-label="Remove data point"
                        onClick={() => removeUsagePoint(dp.id)}
                      />
                    </div>
                  </Stack>
                )
              })}

              <div
                style={{
                  padding: '6px 12px',
                  background: '#f9f9fa',
                  border: '1px solid #d9dadd',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                }}
              >
                <Text as="span" variant="bodySmall" prominence="weak">
                  {dataPoints.length} / {MAX_POINTS} data points
                </Text>
              </div>
            </Stack>
          )}
        </Stack>
      )}

      {/* ---- Roadmap Items ---- */}
      {showRoadmap && (
        <Stack gap={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack gap={0.5}>
              <Text as="h2" variant="headingSmall">
                Roadmap / Next Steps
              </Text>
              <Text as="p" variant="bodySmall" prominence="weak">
                Bullet points that appear on the Roadmap slide.
              </Text>
            </Stack>
            <Button
              variant="outlined"
              sentiment="primary"
              size="small"
              icon={<PlusIcon />}
              iconPosition="left"
              onClick={addRoadmapItem}
            >
              Add item
            </Button>
          </Stack>

          {roadmapItems.length === 0 ? (
            <EmptyState
              title="No roadmap items yet"
              description="Add action items or milestones for the next period."
              icon="list"
              action={{
                label: 'Add first item',
                onClick: addRoadmapItem,
              }}
            />
          ) : (
            <Stack gap={1}>
              {roadmapItems.map((item, idx) => (
                <Stack key={idx} direction="row" gap={1} alignItems="center">
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#8c40ef',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextInput
                      label=""
                      aria-label={`Roadmap item ${idx + 1}`}
                      placeholder="e.g. Kick-off workshop and architecture review"
                      value={item}
                      onChange={(e) => updateRoadmapItem(idx, e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    sentiment="danger"
                    size="small"
                    icon={<DeleteIcon />}
                    aria-label="Remove roadmap item"
                    onClick={() => removeRoadmapItem(idx)}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  )
}

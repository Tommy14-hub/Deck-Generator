/** Round to whole cents. All money math goes through this before display or
 * summation so a displayed total always equals the sum of displayed line
 * totals — never a float artifact like 1234.5600000000001. */
export function roundCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/** Format a number as French-locale EUR currency, e.g. "1 234,56 €" */
export function formatEur(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCents(value))
}

/**
 * Pick a font size for a text box so long strings don't overflow.
 * pptxgenjs's `fit: 'shrink'` only takes effect AFTER the text is edited in
 * PowerPoint — it does nothing on first open — so first-open correctness has
 * to come from us choosing the size up front. Steps down from `baseSize` as
 * the text grows past `baseChars`, never below `minSize`.
 */
export function fitFontSize(
  text: string,
  { baseSize, baseChars, minSize }: { baseSize: number; baseChars: number; minSize: number },
): number {
  const overflow = text.length - baseChars
  if (overflow <= 0) return baseSize
  const steps = Math.ceil(overflow / baseChars)
  return Math.max(minSize, baseSize - steps * 4)
}

/** Truncate very long strings with an ellipsis so they never break layout */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

/** Format a number as French-locale EUR currency, e.g. "1 234,56 €" */
export function formatEur(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Pick a font size for a single-line text box so long strings don't overflow
 * their box. Steps down from `baseSize` in fixed decrements once the text
 * exceeds `baseChars` characters, never going below `minSize`.
 */
export function fitFontSize(
  text: string,
  { baseSize, baseChars, minSize }: { baseSize: number; baseChars: number; minSize: number },
): number {
  const overflow = text.length - baseChars
  if (overflow <= 0) return baseSize
  const steps = Math.ceil(overflow / baseChars)
  return Math.max(minSize, baseSize - steps * 2)
}

/** Truncate very long strings with an ellipsis so they never break table layout */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

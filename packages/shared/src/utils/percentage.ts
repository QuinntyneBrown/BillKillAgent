export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

export function calculateSavingsPercentage(original: number, reduced: number): number {
  if (original === 0) return 0;
  return ((original - reduced) / original) * 100;
}

export function formatCurrency(
  amount: number,
  options?: { currency?: string; locale?: string; compact?: boolean }
): string {
  const { currency = "USD", locale = "en-US", compact = false } = options ?? {};

  if (compact && Math.abs(amount) >= 1000) {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
    return formatted;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, ""));
}

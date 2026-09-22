export function formatCurrency(value: number, options: { showSign?: boolean } = {}): string {
  const { showSign = false } = options;
  const sign = showSign && value > 0 ? "+" : "";
  const formatted = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value < 0 ? "-" : sign}$${formatted}`;
}

export function formatCompactCurrency(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const formatted =
    abs >= 1000 ? `${(abs / 1000).toFixed(1)}k` : abs.toFixed(0);
  return `${sign}$${formatted}`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

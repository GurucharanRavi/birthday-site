/** True when a CMS string should render (empty / whitespace = hidden). */
export function hasText(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

/** Custom font field wins over the preset dropdown when filled in. */
export function resolveFont(preset: string, custom?: string): string {
  const override = custom?.trim();
  if (override) return override;
  const base = preset?.trim();
  return base || "system-ui, sans-serif";
}

export function objectPosition(x?: number, y?: number): string {
  const px = clampPercent(x ?? 50);
  const py = clampPercent(y ?? 50);
  return `${px}% ${py}%`;
}

function clampPercent(n: number): number {
  return Math.min(100, Math.max(0, Number(n) || 50));
}

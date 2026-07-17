export function parseClampedInt(value: string, min: number, max: number): number | null {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return Math.min(max, Math.max(min, n));
}

import type { Indicator } from "@/types/chemistry";

/**
 * Fraction of the indicator in its basic (deprotonated) form, from
 * Henderson–Hasselbalch:  pH = pKa_HIn + log(f / (1−f))
 */
export function fractionBasicForm(pH: number, indicator: Indicator): number {
  const ratio = Math.pow(10, pH - indicator.pKaHIn);
  return ratio / (1 + ratio);
}

/**
 * Linearly interpolate the acid and base colors of the indicator.
 * Accepts CSS hex strings ("#rrggbb"); returns hex.
 */
export function indicatorColor(pH: number, indicator: Indicator): string {
  const t = fractionBasicForm(pH, indicator);
  const a = parseHex(indicator.acidColor);
  const b = parseHex(indicator.baseColor);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bch = Math.round(a.b + (b.b - a.b) * t);
  return toHex(r, g, bch);
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length !== 6) throw new Error(`expected #rrggbb, got "${hex}"`);
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function toHex(r: number, g: number, b: number): string {
  const toByte = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toByte(r)}${toByte(g)}${toByte(b)}`;
}

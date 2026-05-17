/**
 * CO₂ drift model.
 *
 * Above pH ~ 7, atmospheric CO₂ reacts with the basic solution:
 *   OH⁻ + CO₂ → HCO₃⁻        ;        OH⁻ + HCO₃⁻ → CO₃²⁻ + H₂O
 * The net effect is that strong base is steadily neutralized over seconds
 * to minutes of standing — the visible symptom is phenolphthalein fading
 * from pink back toward colorless. Real labs work around this by titrating
 * promptly and by recognizing "persistent pink" rather than "first pink".
 *
 * Modelled here as a linear-in-time drift in *displayed* pH, capped so that
 * the displayed pH never falls below the threshold (pH 7). Reset to zero
 * whenever the solution is mixed (= a new drop is added, or the student
 * swirls).
 */

export const CO2_PH_THRESHOLD = 7.0;
export const CO2_DRIFT_RATE_PER_PH_PER_S = 0.05;

export function co2DriftPH(timeSinceMixing_s: number, equilibriumPH: number): number {
  if (timeSinceMixing_s <= 0) return 0;
  if (equilibriumPH <= CO2_PH_THRESHOLD) return 0;
  const above = equilibriumPH - CO2_PH_THRESHOLD;
  const linear = CO2_DRIFT_RATE_PER_PH_PER_S * above * timeSinceMixing_s;
  return Math.min(linear, above);
}

export function displayPH(equilibriumPH: number, timeSinceMixing_s: number): number {
  return equilibriumPH - co2DriftPH(timeSinceMixing_s, equilibriumPH);
}

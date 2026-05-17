import { describe, expect, it } from "vitest";
import {
  CO2_DRIFT_RATE_PER_PH_PER_S,
  CO2_PH_THRESHOLD,
  co2DriftPH,
  displayPH,
} from "@/lib/chemistry/co2-drift";

describe("co2DriftPH", () => {
  it("is zero at t = 0", () => {
    expect(co2DriftPH(0, 10)).toBe(0);
  });

  it("is zero when equilibrium pH is at or below the threshold", () => {
    expect(co2DriftPH(60, CO2_PH_THRESHOLD)).toBe(0);
    expect(co2DriftPH(60, 5)).toBe(0);
  });

  it("grows linearly with time, faster at higher equilibrium pH", () => {
    const at5_pH9 = co2DriftPH(5, 9);
    const at5_pH10 = co2DriftPH(5, 10);
    expect(at5_pH10).toBeGreaterThan(at5_pH9);
    expect(co2DriftPH(10, 9)).toBeCloseTo(2 * at5_pH9, 6);
  });

  it("never pulls displayed pH below the threshold", () => {
    expect(displayPH(9.0, 10_000)).toBeGreaterThanOrEqual(CO2_PH_THRESHOLD - 1e-9);
    expect(displayPH(8.5, 60)).toBeGreaterThanOrEqual(CO2_PH_THRESHOLD - 1e-9);
  });

  it("matches the documented rate near the threshold", () => {
    const t = 1;
    const eqPH = CO2_PH_THRESHOLD + 1;
    expect(co2DriftPH(t, eqPH)).toBeCloseTo(CO2_DRIFT_RATE_PER_PH_PER_S * 1 * t, 8);
  });

  it("fades phenolphthalein on a realistic timescale (~10 s drop from pH 9 toward 8.5)", () => {
    const start = displayPH(9, 0);
    const after10s = displayPH(9, 10);
    expect(start - after10s).toBeGreaterThan(0.5);
  });
});

import { describe, expect, it } from "vitest";
import {
  pH,
  pHBuffer,
  pHEquivalenceWeakAcidStrongBase,
  pHWeakAcid,
} from "@/lib/chemistry/ph";

describe("pH primitives", () => {
  it("computes pH from [H+]", () => {
    expect(pH(1e-7)).toBeCloseTo(7, 6);
    expect(pH(1e-3)).toBeCloseTo(3, 6);
  });

  it("rejects nonpositive [H+]", () => {
    expect(() => pH(0)).toThrow();
    expect(() => pH(-1)).toThrow();
  });
});

describe("pHWeakAcid (acetic acid)", () => {
  it("matches Tro's 0.10 M acetic acid example (Tro §16.6) within textbook precision", () => {
    // Tro's worked example uses the small-x approximation and reports pH ≈ 2.87.
    // The quadratic-exact value (what we compute) is 2.875 — within 0.005 of Tro.
    const result = pHWeakAcid(0.1, 1.8e-5);
    expect(result).toBeCloseTo(2.87, 1);
    expect(result).toBeCloseTo(2.875, 2);
  });

  it("returns higher pH at lower concentration", () => {
    const dilute = pHWeakAcid(0.01, 1.8e-5);
    const concentrated = pHWeakAcid(0.1, 1.8e-5);
    expect(dilute).toBeGreaterThan(concentrated);
  });
});

describe("pHBuffer (Henderson–Hasselbalch)", () => {
  it("returns pKa at half-equivalence", () => {
    const pKa = -Math.log10(1.8e-5);
    expect(pHBuffer(1, 1, 1.8e-5)).toBeCloseTo(pKa, 6);
  });

  it("is basic when [A⁻] > [HA]", () => {
    expect(pHBuffer(2, 1, 1.8e-5)).toBeGreaterThan(-Math.log10(1.8e-5));
  });
});

describe("pHEquivalenceWeakAcidStrongBase", () => {
  it("is basic (pH > 7) for acetate", () => {
    const p = pHEquivalenceWeakAcidStrongBase(0.05, 1.8e-5);
    expect(p).toBeGreaterThan(7);
    expect(p).toBeLessThan(10);
  });
});

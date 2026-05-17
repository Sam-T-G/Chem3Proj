import { describe, expect, it } from "vitest";
import { ACETIC_ACID, PHENOLPHTHALEIN, SODIUM_HYDROXIDE } from "@/lib/chemistry/constants";
import {
  concentrationFromEndpoint,
  equivalenceVolume_mL,
  indicatorEndpointVolume,
  pHAt,
  regionAt,
  titrationCurve,
} from "@/lib/chemistry/titration";
import type { TitrationSetup } from "@/types/chemistry";

const SETUP: TitrationSetup = {
  analyte: ACETIC_ACID,
  analyteSolution: { concentration: 0.1, volume_mL: 25 },
  titrant: SODIUM_HYDROXIDE,
  titrantConcentration: 0.1,
};

describe("equivalenceVolume_mL", () => {
  it("equals analyte volume when concentrations match (1:1 stoichiometry)", () => {
    expect(equivalenceVolume_mL(SETUP)).toBeCloseTo(25, 6);
  });

  it("scales inversely with titrant concentration", () => {
    const dilute = { ...SETUP, titrantConcentration: 0.05 };
    expect(equivalenceVolume_mL(dilute)).toBeCloseTo(50, 6);
  });
});

describe("regionAt", () => {
  it("classifies the four canonical regions", () => {
    expect(regionAt(0, SETUP)).toBe("initial");
    expect(regionAt(10, SETUP)).toBe("buffer");
    expect(regionAt(12.5, SETUP)).toBe("half-equivalence");
    expect(regionAt(25, SETUP)).toBe("equivalence");
    expect(regionAt(30, SETUP)).toBe("post-equivalence");
  });
});

describe("pHAt (canonical anchor points for 0.1 M HOAc + 0.1 M NaOH)", () => {
  it("starts near pH 2.87 (Tro §16.6 approximation; quadratic gives 2.875)", () => {
    expect(pHAt(0, SETUP)).toBeCloseTo(2.87, 1);
  });

  it("equals pKa at half-equivalence", () => {
    const pKa = -Math.log10(1.8e-5);
    expect(pHAt(12.5, SETUP)).toBeCloseTo(pKa, 2);
  });

  it("is basic (~8.7) at equivalence", () => {
    const p = pHAt(25, SETUP);
    expect(p).toBeGreaterThan(8);
    expect(p).toBeLessThan(9.2);
  });

  it("climbs past 12 well into excess base", () => {
    expect(pHAt(50, SETUP)).toBeGreaterThan(12);
  });
});

describe("titrationCurve", () => {
  it("produces a monotonically non-decreasing pH curve", () => {
    const curve = titrationCurve(SETUP, { stepCount: 200 });
    for (let i = 1; i < curve.length; i++) {
      expect(curve[i]!.pH).toBeGreaterThanOrEqual(curve[i - 1]!.pH - 1e-6);
    }
  });

  it("uses sensible defaults when no options are passed", () => {
    const curve = titrationCurve(SETUP);
    expect(curve.length).toBe(201);
    expect(curve[0]!.volumeAdded_mL).toBe(0);
    expect(curve.at(-1)!.volumeAdded_mL).toBeGreaterThan(equivalenceVolume_mL(SETUP));
  });
});

describe("concentrationFromEndpoint", () => {
  it("inverts the titration cleanly when endpoint = Veq", () => {
    const c = concentrationFromEndpoint(25, 0.1, 25);
    expect(c).toBeCloseTo(0.1, 6);
  });
});

describe("indicatorEndpointVolume (phenolphthalein on 0.1 M HOAc + 0.1 M NaOH)", () => {
  it("sits just past the equivalence point (indicator error is small but real)", () => {
    const V_endpoint = indicatorEndpointVolume(SETUP, PHENOLPHTHALEIN);
    const Veq = equivalenceVolume_mL(SETUP);
    expect(V_endpoint).toBeGreaterThan(Veq);
    expect(V_endpoint - Veq).toBeLessThan(1.0);
  });

  it("solves pHAt(V_endpoint) ≈ pKa_HIn within tolerance", () => {
    const V_endpoint = indicatorEndpointVolume(SETUP, PHENOLPHTHALEIN);
    expect(pHAt(V_endpoint, SETUP)).toBeCloseTo(PHENOLPHTHALEIN.pKaHIn, 2);
  });
});

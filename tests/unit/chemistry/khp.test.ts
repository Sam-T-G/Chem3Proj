import { describe, expect, it } from "vitest";
import {
  KHP_MOLAR_MASS,
  khpStandardSetup,
  naOHMolarityFromKHPStandardization,
} from "@/lib/chemistry/khp";
import { pHAt } from "@/lib/chemistry/titration";

describe("KHP standardization helpers", () => {
  it("builds a setup with the right analyte concentration", () => {
    const setup = khpStandardSetup({
      khpMass_g: 0.5,
      waterVolume_mL: 50,
      nominalNaOHMolarity: 0.1,
    });
    const expected = 0.5 / KHP_MOLAR_MASS / 0.05;
    expect(setup.analyteSolution.concentration).toBeCloseTo(expected, 6);
  });

  it("recovers NaOH molarity from a perfect endpoint", () => {
    const khpMass = 0.5;
    const trueNaOH = 0.0987;
    const expectedVeq_mL = ((khpMass / KHP_MOLAR_MASS) / trueNaOH) * 1000;
    const recovered = naOHMolarityFromKHPStandardization(khpMass, expectedVeq_mL);
    expect(recovered).toBeCloseTo(trueNaOH, 6);
  });

  it("standardization titration goes basic at equivalence (phenolphthalein still works)", () => {
    const setup = khpStandardSetup({
      khpMass_g: 0.5,
      waterVolume_mL: 50,
      nominalNaOHMolarity: 0.1,
    });
    const Veq =
      ((setup.analyteSolution.concentration * setup.analyteSolution.volume_mL) /
        setup.titrantConcentration);
    const pHAtEq = pHAt(Veq, setup);
    expect(pHAtEq).toBeGreaterThan(7);
    expect(pHAtEq).toBeLessThan(11);
  });

  it("rejects nonsensical endpoint volumes", () => {
    expect(() => naOHMolarityFromKHPStandardization(0.5, 0)).toThrow();
    expect(() => naOHMolarityFromKHPStandardization(0.5, -1)).toThrow();
  });
});

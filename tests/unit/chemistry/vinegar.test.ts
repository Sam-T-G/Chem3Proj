import { describe, expect, it } from "vitest";
import {
  percentAceticFromMolarity,
  vinegarMolarity,
  vinegarTitrationSetup,
} from "@/lib/chemistry/vinegar";

describe("vinegarMolarity", () => {
  it("converts 5% (m/m) into ≈ 0.836 M acetic acid", () => {
    const m = vinegarMolarity(5.0);
    expect(m).toBeCloseTo(0.836, 2);
  });

  it("inverts via percentAceticFromMolarity", () => {
    const m = vinegarMolarity(4.5);
    expect(percentAceticFromMolarity(m)).toBeCloseTo(4.5, 4);
  });
});

describe("vinegarTitrationSetup", () => {
  it("applies the dilution factor to the analyte concentration", () => {
    const setup = vinegarTitrationSetup({
      vinegarPercent: 5,
      sampleVolume_mL: 25,
      dilutionFactor: 10,
      titrantConcentration: 0.1,
    });
    const undiluted = vinegarMolarity(5);
    expect(setup.analyteSolution.concentration).toBeCloseTo(undiluted / 10, 6);
  });
});

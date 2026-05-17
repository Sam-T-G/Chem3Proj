import { describe, expect, it } from "vitest";
import { PHENOLPHTHALEIN } from "@/lib/chemistry/constants";
import { fractionBasicForm, indicatorColor } from "@/lib/chemistry/indicators";

describe("fractionBasicForm", () => {
  it("is 0.5 at pH = pKaHIn", () => {
    expect(fractionBasicForm(PHENOLPHTHALEIN.pKaHIn, PHENOLPHTHALEIN)).toBeCloseTo(0.5, 6);
  });

  it("is nearly 0 well below the transition range", () => {
    expect(fractionBasicForm(3, PHENOLPHTHALEIN)).toBeLessThan(1e-4);
  });

  it("is nearly 1 well above the transition range", () => {
    expect(fractionBasicForm(13, PHENOLPHTHALEIN)).toBeGreaterThan(0.999);
  });
});

describe("indicatorColor", () => {
  it("returns the acid color at low pH", () => {
    expect(indicatorColor(2, PHENOLPHTHALEIN).toLowerCase()).toBe(
      PHENOLPHTHALEIN.acidColor.toLowerCase(),
    );
  });

  it("returns the base color at high pH", () => {
    expect(indicatorColor(13, PHENOLPHTHALEIN).toLowerCase()).toBe(
      PHENOLPHTHALEIN.baseColor.toLowerCase(),
    );
  });

  it("throws on malformed hex colors", () => {
    const broken = { ...PHENOLPHTHALEIN, acidColor: "#fff" };
    expect(() => indicatorColor(7, broken)).toThrow(/rrggbb/);
  });
});

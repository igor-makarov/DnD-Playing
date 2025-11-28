import { describe, expect, it } from "vitest";

import { calculateNewPoints } from "./calculatePoints";

describe("calculateNewPoints", () => {
  const maximum = 10;
  const currentValue = 5;

  it("should return maximum when input is empty string", () => {
    expect(calculateNewPoints("", currentValue, { maximum })).toBe(maximum);
  });

  it("should return currentValue when input has illegal characters", () => {
    expect(calculateNewPoints("abc", currentValue, { maximum })).toBe(currentValue);
  });

  it("should parse direct number input and clamp it within 0 and maximum", () => {
    expect(calculateNewPoints("7", currentValue, { maximum })).toBe(7);
    expect(calculateNewPoints("15", currentValue, { maximum })).toBe(maximum); // Clamped to maximum
    expect(calculateNewPoints("-5", currentValue, { maximum })).toBe(0); // Clamped to 0
  });

  it("should handle arithmetic expressions", () => {
    expect(calculateNewPoints("5+2", currentValue, { maximum })).toBe(7);
    expect(calculateNewPoints("10-3", currentValue, { maximum })).toBe(7);
    expect(calculateNewPoints("1+1+1", currentValue, { maximum })).toBe(3);
    expect(calculateNewPoints("10-100", currentValue, { maximum })).toBe(0); // Clamped to 0
    expect(calculateNewPoints("1+100", currentValue, { maximum })).toBe(maximum); // Clamped to maximum
  });

  describe("allowAboveMaximum option", () => {
    it("should allow values above maximum when allowAboveMaximum is true", () => {
      expect(calculateNewPoints("15", currentValue, { maximum, allowAboveMaximum: true })).toBe(15);
    });

    it("should still clamp to 0 for negative values when allowAboveMaximum is true", () => {
      expect(calculateNewPoints("-5", currentValue, { maximum, allowAboveMaximum: true })).toBe(0);
    });

    it("should handle arithmetic expressions above maximum when allowAboveMaximum is true", () => {
      expect(calculateNewPoints("10+5", currentValue, { maximum, allowAboveMaximum: true })).toBe(15);
      expect(calculateNewPoints("100-50", currentValue, { maximum, allowAboveMaximum: true })).toBe(50);
    });

    it("should return 0 when input is empty string and currentValue is 0 and allowAboveMaximum is true", () => {
      // Assuming a scenario where current is 0 and we want to keep it 0 if empty and above max is allowed
      expect(calculateNewPoints("", 0, { maximum, allowAboveMaximum: true })).toBe(0);
    });
  });
});

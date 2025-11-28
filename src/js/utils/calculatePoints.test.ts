import { describe, expect, it } from "vitest";

import { calculateNewPoints } from "./calculatePoints";

describe("calculateNewPoints", () => {
  const defaultValue = 10;
  const currentValue = 5;

  it("should return defaultValue when input is empty string", () => {
    expect(calculateNewPoints("", currentValue, { defaultValue })).toBe(defaultValue);
  });

  it("should return currentValue when input has illegal characters", () => {
    expect(calculateNewPoints("abc", currentValue, { defaultValue })).toBe(currentValue);
  });

  it("should parse direct number input and clamp it within 0 (if no maximum is provided)", () => {
    expect(calculateNewPoints("7", currentValue, { defaultValue })).toBe(7);
    expect(calculateNewPoints("15", currentValue, { defaultValue })).toBe(15); // Should not be clamped to defaultValue
    expect(calculateNewPoints("-5", currentValue, { defaultValue })).toBe(0); // Clamped to 0
  });

  it("should allow values above defaultValue when no maximum is provided", () => {
    expect(calculateNewPoints("100", currentValue, { defaultValue })).toBe(100);
  });

  it("should handle arithmetic expressions", () => {
    expect(calculateNewPoints("5+2", currentValue, { defaultValue })).toBe(7);
    expect(calculateNewPoints("10-3", currentValue, { defaultValue })).toBe(7);
    expect(calculateNewPoints("1+1+1", currentValue, { defaultValue })).toBe(3);
    expect(calculateNewPoints("10-100", currentValue, { defaultValue })).toBe(0); // Clamped to 0
    expect(calculateNewPoints("1+100", currentValue, { defaultValue })).toBe(101);
  });

  describe("maximum option", () => {
    const customMaximum = 20;

    it("should allow values above defaultValue when maximum is provided", () => {
      expect(calculateNewPoints("15", currentValue, { defaultValue, maximum: customMaximum })).toBe(15);
      expect(calculateNewPoints("25", currentValue, { defaultValue, maximum: customMaximum })).toBe(customMaximum); // Clamped to customMaximum
    });

    it("should still clamp to 0 for negative values when maximum is provided", () => {
      expect(calculateNewPoints("-5", currentValue, { defaultValue, maximum: customMaximum })).toBe(0);
    });

    it("should handle arithmetic expressions with a provided maximum", () => {
      expect(calculateNewPoints("10+5", currentValue, { defaultValue, maximum: customMaximum })).toBe(15);
      expect(calculateNewPoints("100-50", currentValue, { defaultValue, maximum: customMaximum })).toBe(customMaximum);
      expect(calculateNewPoints("10+15", currentValue, { defaultValue, maximum: customMaximum })).toBe(customMaximum); // Clamped to customMaximum
    });

    it("should return 0 when input is empty string and currentValue is 0 and no maximum is provided", () => {
      // If no maximum is provided, and the currentValue is 0, and input is empty, it should remain 0
      expect(calculateNewPoints("", 0, { defaultValue })).toBe(0);
    });

    it("should return defaultValue when input is empty string and currentValue is 0 and maximum is provided", () => {
      // If a maximum is provided, even if currentValue is 0 and input is empty, it should return defaultValue
      expect(calculateNewPoints("", 0, { defaultValue, maximum: customMaximum })).toBe(defaultValue);
    });
  });
});

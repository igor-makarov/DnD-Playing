import { describe, expect, it } from "vitest";

import { DiceString } from "@/js/common/DiceString";

import { restoreHitDice } from "./restoreHitDice";

describe("restoreHitDice", () => {
  describe("Azamat (Paladin - all d10)", () => {
    const azamatHitDice = [{ die: new DiceString("d10"), count: 14 }];

    it("should restore half (7) of total hit dice when all are spent", () => {
      const currentHitDice = { d10: 0 }; // All 14 spent
      const result = restoreHitDice(azamatHitDice, currentHitDice);

      expect(result).toEqual({ d10: 7 });
    });

    it("should restore minimum 1 when only 1 is spent", () => {
      const currentHitDice = { d10: 13 }; // Only 1 spent
      const result = restoreHitDice(azamatHitDice, currentHitDice);

      expect(result).toEqual({ d10: undefined }); // Restored to max
    });

    it("should restore all spent dice if less than half", () => {
      const currentHitDice = { d10: 11 }; // Only 3 spent
      const result = restoreHitDice(azamatHitDice, currentHitDice);

      expect(result).toEqual({ d10: undefined }); // Restore all 3, back to max
    });

    it("should restore maximum available when more than half are spent", () => {
      const currentHitDice = { d10: 4 }; // 10 spent, can restore 7
      const result = restoreHitDice(azamatHitDice, currentHitDice);

      expect(result).toEqual({ d10: 11 }); // 4 + 7 = 11
    });

    it("should return undefined when restored to maximum", () => {
      const currentHitDice = { d10: 8 }; // 6 spent, can restore 7, but only 6 to restore
      const result = restoreHitDice(azamatHitDice, currentHitDice);

      expect(result).toEqual({ d10: undefined }); // Back to maximum
    });

    it("should not restore anything when no dice are spent", () => {
      const currentHitDice = {}; // undefined means maximum
      const result = restoreHitDice(azamatHitDice, currentHitDice);

      expect(result).toEqual({});
    });
  });

  describe("Adrik (multiclass Ranger/Cleric - d10 and d8)", () => {
    const adrikHitDice = [
      { die: new DiceString("d10"), count: 5 }, // Ranger levels 1-5
      { die: new DiceString("d8"), count: 7 }, // Cleric levels 6-12
    ];
    // Total: 12 dice, can restore 6 per long rest

    it("should restore half (6) of total hit dice when all are spent", () => {
      const currentHitDice = { d10: 0, d8: 0 }; // All 12 spent
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      // Should restore largest dice first: all 5 d10s (to max = undefined), then 1 d8
      expect(result).toEqual({ d10: undefined, d8: 1 });
    });

    it("should restore largest dice first when partially spent", () => {
      const currentHitDice = { d10: 2, d8: 3 }; // 3 d10 + 4 d8 = 7 spent, can restore 6
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      // Restore 3 d10s first (back to 5 = undefined), then 3 d8s (from 3 to 6)
      expect(result).toEqual({ d10: undefined, d8: 6 });
    });

    it("should restore to undefined when die type is back to maximum", () => {
      const currentHitDice = { d10: 3, d8: 7 }; // Only 2 d10 spent, can restore 6 but only need 2
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      // Restore 2 d10s to max (undefined), no d8s spent
      expect(result).toEqual({ d10: undefined, d8: 7 });
    });

    it("should handle when only smaller dice are spent", () => {
      const currentHitDice = { d10: 5, d8: 1 }; // Only 6 d8 spent, can restore 6
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      // All spent d8s are restored
      expect(result).toEqual({ d10: 5, d8: undefined });
    });

    it("should restore minimum 1 even when only 1 die is spent", () => {
      const currentHitDice = { d10: 4, d8: 7 }; // Only 1 d10 spent
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      expect(result).toEqual({ d10: undefined, d8: 7 }); // Restore that 1 d10
    });

    it("should handle partially spent dice across types", () => {
      const currentHitDice = { d10: 1, d8: 5 }; // 4 d10 + 2 d8 = 6 spent
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      // Restore all 4 d10s (to 5), then 2 d8s (to 7)
      expect(result).toEqual({ d10: undefined, d8: undefined });
    });

    it("should not restore when no dice are spent", () => {
      const currentHitDice = {}; // All at maximum
      const result = restoreHitDice(adrikHitDice, currentHitDice);

      expect(result).toEqual({});
    });
  });

  describe("edge cases", () => {
    it("should handle character with only 1 hit die", () => {
      const hitDiceByType = [{ die: new DiceString("d6"), count: 1 }];
      const currentHitDice = { d6: 0 }; // Spent

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      // Minimum restoration is 1
      expect(result).toEqual({ d6: undefined }); // Back to max (1)
    });

    it("should handle character with 2 hit dice", () => {
      const hitDiceByType = [{ die: new DiceString("d8"), count: 2 }];
      const currentHitDice = { d8: 0 }; // Both spent

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      // Half of 2 is 1, minimum is 1
      expect(result).toEqual({ d8: 1 });
    });

    it("should handle odd number of total hit dice", () => {
      const hitDiceByType = [{ die: new DiceString("d12"), count: 15 }];
      const currentHitDice = { d12: 0 }; // All 15 spent

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      // Half of 15 is 7.5, floor to 7
      expect(result).toEqual({ d12: 7 });
    });

    it("should preserve existing values for unspent dice types", () => {
      const hitDiceByType = [
        { die: new DiceString("d12"), count: 3 },
        { die: new DiceString("d6"), count: 2 },
      ];
      const currentHitDice = { d12: 1, d6: 2 }; // Only d12s spent

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      // Restore 2 d12s (can restore up to 2, floor(5/2)=2)
      expect(result).toEqual({ d12: undefined, d6: 2 });
    });

    it("should handle empty hit dice configuration", () => {
      const hitDiceByType: Array<{ die: DiceString; count: number }> = [];
      const currentHitDice = {};

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      expect(result).toEqual({});
    });
  });

  describe("restoration priority (largest dice first)", () => {
    it("should prioritize d12 > d10 > d8 > d6", () => {
      const hitDiceByType = [
        { die: new DiceString("d12"), count: 2 },
        { die: new DiceString("d10"), count: 3 },
        { die: new DiceString("d8"), count: 4 },
        { die: new DiceString("d6"), count: 5 },
      ];
      const currentHitDice = { d12: 0, d10: 0, d8: 0, d6: 0 }; // All 14 spent, can restore 7

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      // Restore in order: 2 d12s, 3 d10s, 2 d8s (total 7)
      expect(result).toEqual({ d12: undefined, d10: undefined, d8: 2, d6: 0 });
    });

    it("should respect order given in hitDiceByType array", () => {
      // Even if array is not sorted, it should restore in the order provided
      const hitDiceByType = [
        { die: new DiceString("d10"), count: 3 },
        { die: new DiceString("d12"), count: 2 },
      ];
      const currentHitDice = { d10: 0, d12: 0 }; // All 5 spent, can restore 2

      const result = restoreHitDice(hitDiceByType, currentHitDice);

      // Should restore first die type in array first (d10s)
      expect(result).toEqual({ d10: 2, d12: 0 });
    });
  });
});

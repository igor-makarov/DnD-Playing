"use client";
import React from "react";

import { D20Test } from "@/js/common/D20Test";
import { RollModifier, useRollModifiers } from "@/js/hooks/useRollModifiers";

import RollLink from "./RollLink";

export interface Props {
  roll: D20Test;
  advantage?: boolean;
}

export default function D20TestCell({ roll, advantage = false }: Props) {
  const modifier = useRollModifiers();

  const bonus = roll.getBonus();
  const diceString = roll.getDiceString();

  // Get the effective modifier (keyboard modifier overrides advantage prop)
  const effectiveModifier = (() => {
    if (modifier === RollModifier.ADVANTAGE) return RollModifier.ADVANTAGE;
    if (modifier === RollModifier.DISADVANTAGE) return RollModifier.DISADVANTAGE;
    if (modifier === RollModifier.REGULAR) return RollModifier.REGULAR;
    // NONE or any other state: use default based on advantage prop
    return advantage ? RollModifier.ADVANTAGE : RollModifier.REGULAR;
  })();

  const currentCaption = {
    [RollModifier.ADVANTAGE]: "ADV",
    [RollModifier.DISADVANTAGE]: "DIS",
    [RollModifier.REGULAR]: "",
  }[effectiveModifier];

  const mobileOptions = (() => {
    const regOption = { key: "reg", caption: "REG", advantage: false, disadvantage: false };
    const regBonusOption = { key: "bonus", caption: roll.getBonusString(), advantage: false, disadvantage: false };
    const advOption = { key: "adv", caption: "ADV", advantage: true, disadvantage: false };
    const advBonusOption = { key: "adv", caption: `ADV${roll.getBonusString()}`, advantage: true, disadvantage: false };
    const disOption = { key: "dis", caption: "DIS", advantage: false, disadvantage: true };

    if (advantage) {
      return [advBonusOption, regOption, disOption];
    } else {
      return [regBonusOption, advOption, disOption];
    }
  })();

  return (
    <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage}>
      {/* Desktop view: single clickable element */}
      <span className="check-cell-desktop">
        <RollLink
          dice={diceString}
          advantage={effectiveModifier === RollModifier.ADVANTAGE}
          disadvantage={effectiveModifier === RollModifier.DISADVANTAGE}
          title="Hold A: advantage | Hold D: disadvantage | Hold S: regular"
        >
          [{currentCaption}
          {roll.getBonusString()}]
        </RollLink>
      </span>

      {/* Mobile view: multiple links */}
      <span className="check-cell-mobile">
        {mobileOptions.map((option, index) => (
          <span key={index}>
            {index > 0 && <>&nbsp;</>}
            <RollLink dice={diceString} advantage={option.advantage} disadvantage={option.disadvantage}>
              {option.caption}
            </RollLink>
          </span>
        ))}
      </span>
    </span>
  );
}

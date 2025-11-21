import React from "react";

import { useHash } from "../hooks/useHash";
import { RollModifier, useRollModifiers } from "../hooks/useRollModifiers";
import { D20Test } from "../js/common/D20Test";
import { withAutoRehydration } from "../js/utils/rehydratable";
import { getRollUrl } from "../js/utils/rollOptions";

interface CheckCellProps {
  check: D20Test;
  advantage?: boolean;
}

const CheckCell: React.FC<CheckCellProps> = withAutoRehydration(({ check, advantage = false }) => {
  const hash = useHash();
  const { modifier } = useRollModifiers();

  const diceAppKey = hash?.substring(1) || "app";

  const bonus = check.getBonus();
  const diceString = check.getDiceString();

  // Get the effective modifier (keyboard modifier overrides advantage prop)
  const effectiveModifier = (() => {
    if (modifier === RollModifier.ADVANTAGE) return RollModifier.ADVANTAGE;
    if (modifier === RollModifier.DISADVANTAGE) return RollModifier.DISADVANTAGE;
    if (modifier === RollModifier.REGULAR) return RollModifier.REGULAR;
    // NONE or any other state: use default based on advantage prop
    return advantage ? RollModifier.ADVANTAGE : RollModifier.REGULAR;
  })();

  const rollUrls = {
    [RollModifier.ADVANTAGE]: getRollUrl(diceString, diceAppKey, { advantage: true }),
    [RollModifier.DISADVANTAGE]: getRollUrl(diceString, diceAppKey, { disadvantage: true }),
    [RollModifier.REGULAR]: getRollUrl(diceString, diceAppKey),
  };

  const currentCaption = {
    [RollModifier.ADVANTAGE]: "ADV",
    [RollModifier.DISADVANTAGE]: "DIS",
    [RollModifier.REGULAR]: "",
  }[effectiveModifier];
  const currentUrl = rollUrls[effectiveModifier];

  const mobileOptions = (() => {
    const regOption = { key: "reg", caption: "REG", url: rollUrls[RollModifier.REGULAR] };
    const regBonusOption = { key: "bonus", caption: check.getBonusString(), url: rollUrls[RollModifier.REGULAR] };
    const advOption = { key: "adv", caption: "ADV", url: rollUrls[RollModifier.ADVANTAGE] };
    const advBonusOption = { key: "adv", caption: `ADV${check.getBonusString()}`, url: rollUrls[RollModifier.ADVANTAGE] };
    const disOption = { key: "dis", caption: "DIS", url: rollUrls[RollModifier.DISADVANTAGE] };

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
        <a className="dice-roll" href={currentUrl} title="Hold A: advantage | Hold D: disadvantage | Hold S: regular">
          [{currentCaption}
          {check.getBonusString()}]
        </a>
      </span>

      {/* Mobile view: multiple links */}
      <span className="check-cell-mobile">
        {mobileOptions.map((option, index) => (
          <span key={index}>
            {index > 0 && <>&nbsp;</>}
            <a className="dice-roll" href={option.url}>
              {option.caption}
            </a>
          </span>
        ))}
      </span>
    </span>
  );
});

export default CheckCell;

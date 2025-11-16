import React from "react";
import { getRollUrl } from "../js/rollOptions";
import { DiceString } from "../js/DiceString";
import { useRollModifiers, RollModifier } from "../hooks/useRollModifiers";
import { useHash } from "../hooks/useHash";
import { useIsMobile } from "../hooks/useIsMobile";

interface CheckCellProps {
  bonus: number;
  advantage?: boolean;
}

const CheckCell: React.FC<CheckCellProps> = ({ bonus, advantage = false }) => {
  const hash = useHash();
  const isMobile = useIsMobile();
  const { modifier } = useRollModifiers();

  const diceAppKey = hash?.substring(1) || "app";

  const bonusSign = bonus >= 0 ? "+" : "";
  const diceString = DiceString.init("d20", bonus).toString();

  // Determine the current roll type based on A/D/S keys
  const getCurrentRollType = () => {
    if (modifier === RollModifier.REGULAR) return "REG";
    if (modifier === RollModifier.DISADVANTAGE) return "DIS";
    if (modifier === RollModifier.ADVANTAGE) return "ADV";
    return advantage ? "ADV" : "REG";
  };

  const getCurrentUrl = () => {
    if (modifier === RollModifier.REGULAR) {
      return getRollUrl(diceString, diceAppKey);
    }
    if (modifier === RollModifier.DISADVANTAGE) {
      return getRollUrl(diceString, diceAppKey, { disadvantage: true });
    }
    if (modifier === RollModifier.ADVANTAGE) {
      return getRollUrl(diceString, diceAppKey, { advantage: true });
    }
    return advantage ? getRollUrl(diceString, diceAppKey, { advantage: true }) : getRollUrl(diceString, diceAppKey);
  };

  // Desktop view: single clickable element
  if (!isMobile) {
    const rollType = getCurrentRollType();
    const currentUrl = getCurrentUrl();

    return (
      <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage} style={{ position: "relative", display: "inline-block" }}>
        [
        <a href={currentUrl} title="Hold A: advantage | Hold D: disadvantage | Hold S: regular">
          {rollType !== "REG" && `${rollType}`}
          {bonusSign}
          {bonus}
        </a>
        ]
      </span>
    );
  }

  // Mobile view: multiple links (existing UI)
  if (advantage) {
    return (
      <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage}>
        <a className="advantage-link" href={getRollUrl(diceString, diceAppKey, { advantage: true })}>
          ADV
        </a>
        <a className="regular-link" href={getRollUrl(diceString, diceAppKey)}>
          {bonusSign}
          {bonus}
        </a>
        &nbsp;
        <a className="regular-link" href={getRollUrl(diceString, diceAppKey)}>
          REG
        </a>
        &nbsp;
        <a className="disadvantage-link" href={getRollUrl(diceString, diceAppKey, { disadvantage: true })}>
          DIS
        </a>
      </span>
    );
  }

  return (
    <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage}>
      <a className="regular-link" href={getRollUrl(diceString, diceAppKey)}>
        {bonusSign}
        {bonus}
      </a>
      &nbsp;
      <a className="advantage-link" href={getRollUrl(diceString, diceAppKey, { advantage: true })}>
        ADV
      </a>
      &nbsp;
      <a className="disadvantage-link" href={getRollUrl(diceString, diceAppKey, { disadvantage: true })}>
        DIS
      </a>
    </span>
  );
};

export default CheckCell;

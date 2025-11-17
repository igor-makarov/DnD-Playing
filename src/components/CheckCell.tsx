import React from "react";
import { getRollUrl } from "../js/rollOptions";
import { DiceString } from "../js/DiceString";
import { useRollModifiers, RollModifier } from "../hooks/useRollModifiers";
import { useHash } from "../hooks/useHash";

interface CheckCellProps {
  bonus: number;
  advantage?: boolean;
}

const CheckCell: React.FC<CheckCellProps> = ({ bonus, advantage = false }) => {
  const hash = useHash();
  const { modifier } = useRollModifiers();

  const diceAppKey = hash?.substring(1) || "app";

  const bonusSign = bonus >= 0 ? "+" : "";
  const diceString = DiceString.init("d20", bonus).toString();

  // Determine the current roll type based on A/D/S keys
  const getCurrentRollCaption = () => {
    if (modifier === RollModifier.REGULAR) return "";
    if (modifier === RollModifier.DISADVANTAGE) return "DIS";
    if (modifier === RollModifier.ADVANTAGE) return "ADV";
    return advantage ? "ADV" : "";
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

  const currentRollCaption = getCurrentRollCaption();
  const currentUrl = getCurrentUrl();

  return (
    <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage}>
      {/* Desktop view: single clickable element */}
      <span className="check-cell-desktop">
        <a className="dice-roll" href={currentUrl} title="Hold A: advantage | Hold D: disadvantage | Hold S: regular">
          [{currentRollCaption}
          {bonusSign}
          {bonus}]
        </a>
      </span>

      {/* Mobile view: multiple links */}
      {advantage ? (
        <span className="check-cell-mobile">
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey, { advantage: true })}>
            ADV
          </a>
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey)}>
            {bonusSign}
            {bonus}
          </a>
          &nbsp;
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey)}>
            REG
          </a>
          &nbsp;
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey, { disadvantage: true })}>
            DIS
          </a>
        </span>
      ) : (
        <span className="check-cell-mobile">
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey)}>
            {bonusSign}
            {bonus}
          </a>
          &nbsp;
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey, { advantage: true })}>
            ADV
          </a>
          &nbsp;
          <a className="dice-roll" href={getRollUrl(diceString, diceAppKey, { disadvantage: true })}>
            DIS
          </a>
        </span>
      )}
    </span>
  );
};

export default CheckCell;

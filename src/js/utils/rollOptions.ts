import { DiceString } from "../common/DiceString";

export const rollOptions: Record<string, (diceExpression: DiceString, options?: { advantage?: boolean; disadvantage?: boolean }) => string> = {
  app: function (diceExpression, { advantage, disadvantage } = {}) {
    let suffix: string;
    if (advantage) {
      suffix = "(ADV)";
    } else if (disadvantage) {
      suffix = "(DIS)";
    } else {
      suffix = "";
    }
    return `dice://roll/${diceExpression}${suffix}`;
  },
  site: function (diceExpression, { advantage, disadvantage } = {}) {
    let finalExpression: string;
    if (advantage) {
      finalExpression = diceExpression.toMaxString();
    } else if (disadvantage) {
      finalExpression = diceExpression.toMinString();
    } else {
      finalExpression = diceExpression.toString();
    }
    return `https://dice.run/#/d/${finalExpression}`;
  },
};

export function getRollUrl(
  diceExpression: DiceString,
  diceAppKey: string = "app",
  options?: { advantage?: boolean; disadvantage?: boolean },
): string {
  const diceUrlFunction = rollOptions[diceAppKey] || rollOptions["app"];
  return diceUrlFunction(diceExpression, options);
}

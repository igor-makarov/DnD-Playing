import { DiceString } from "./DiceString";

export const rollOptions: Record<string, (diceExpression: string, options?: { advantage?: boolean; disadvantage?: boolean }) => string> = {
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
      finalExpression = new DiceString(diceExpression).toMaxString();
    } else if (disadvantage) {
      finalExpression = new DiceString(diceExpression).toMinString();
    } else {
      finalExpression = diceExpression;
    }
    return `https://dice.run/#/d/${finalExpression}`;
  },
};

export function getRollUrl(diceExpression: string, diceAppKey: string = "app", options?: { advantage?: boolean; disadvantage?: boolean }): string {
  const diceUrlFunction = rollOptions[diceAppKey] || rollOptions["app"];
  return diceUrlFunction(diceExpression, options);
}

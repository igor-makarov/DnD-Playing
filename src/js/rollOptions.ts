export const rollOptions: Record<string, (diceExpression: string, options?: { advantage?: boolean; disadvantage?: boolean }) => string> = {
  app: function (diceExpression, { advantage, disadvantage } = {}) {
    let suffix = ''
    if (advantage) {
      suffix = '(ADV)'
    } else if (disadvantage) {
      suffix = '(DIS)'
    }
    return `dice://roll/${diceExpression}${suffix}`
  },
  site: function (diceExpression, { advantage, disadvantage } = {}) {
    if (advantage) {
      // For advantage with dice, we'd need special handling
      // For now, just append the dice expression
      return `https://dice.run/#/d/${diceExpression}(ADV)`
    } else if (disadvantage) {
      return `https://dice.run/#/d/${diceExpression}(DIS)`
    }
    return `https://dice.run/#/d/${diceExpression}`
  }
};

export function getRollUrl(diceExpression: string, diceAppKey: string = 'app', options?: { advantage?: boolean; disadvantage?: boolean }): string {
  const diceUrlFunction = rollOptions[diceAppKey] || rollOptions['app'];
  return diceUrlFunction(diceExpression, options);
}

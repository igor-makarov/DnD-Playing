
import React, { useSyncExternalStore } from 'react';

const rollOptions: Record<string, (bonus: number, options?: { advantage?: boolean; disadvantage?: boolean }) => string> = {
  app: function (bonus, { advantage, disadvantage } = {}) {
    let suffix = ''
    if (advantage) {
      suffix = '(ADV)'
    } else if (disadvantage) {
      suffix = '(DIS)'
    }
    return `dice://roll/d20+${bonus}${suffix}`
  },
  site: function (bonus, { advantage, disadvantage } = {}) {
    let bonusSuffix = bonus !== 0 ? `+${bonus}` : ''
    let roll = ''
    if (advantage) {
      roll = '2d20max'
    } else if (disadvantage) {
      roll = '2d20min'
    } else {
      roll = 'd20'
    }
    return `https://dice.run/#/d/${roll}${bonusSuffix}`
  }
};

// This function subscribes to the hashchange event
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

// This function gets the current value of the hash
function getSnapshot() {
  return window.location.hash;
}

// Since this is a client-only component, the server snapshot can be a dummy value.
const getServerSnapshot = () => '';

interface CheckCellProps {
  bonus: number;
  advantage?: boolean;
}

const CheckCell: React.FC<CheckCellProps> = ({ bonus, advantage = false }) => {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const diceAppKey = hash?.substring(1) || 'app';
  const diceUrlFunction = rollOptions[diceAppKey] || rollOptions['app'];

  const bonusSign = bonus >= 0 ? '+' : '';

  return (
    <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage}>
      <a className="regular-link" href={diceUrlFunction(bonus)}>{bonusSign}{bonus}</a>
      &nbsp;
      <a className="advantage-link" href={diceUrlFunction(bonus, { advantage: true })}>
        {advantage ? <strong>ADV</strong> : 'ADV'}
      </a>
      &nbsp;
      <a className="disadvantage-link" href={diceUrlFunction(bonus, { disadvantage: true })}>DIS</a>
    </span>
  );
};

export default CheckCell;

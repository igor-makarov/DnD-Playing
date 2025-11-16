
import React, { useSyncExternalStore } from 'react';
import { getRollUrl } from '../js/rollOptions';

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

  const bonusSign = bonus >= 0 ? '+' : '';
  const diceExpression = `d20${bonusSign}${bonus}`;

  return (
    <span className="mono check-cell" data-bonus={bonus} data-advantage={advantage}>
      <a className="regular-link" href={getRollUrl(diceExpression, diceAppKey)}>{bonusSign}{bonus}</a>
      &nbsp;
      <a className="advantage-link" href={getRollUrl(diceExpression, diceAppKey, { advantage: true })}>
        {advantage ? <strong>ADV</strong> : 'ADV'}
      </a>
      &nbsp;
      <a className="disadvantage-link" href={getRollUrl(diceExpression, diceAppKey, { disadvantage: true })}>DIS</a>
    </span>
  );
};

export default CheckCell;

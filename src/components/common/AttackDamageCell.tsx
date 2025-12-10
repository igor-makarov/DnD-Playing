import { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

import AttackDamageCellClient from "./AttackDamageCell.client";

export interface Props {
  dice: DiceString;
}

const AttackDamageCell: React.FC<Props> = withAutoRehydration(AttackDamageCellClient);
export default AttackDamageCell;

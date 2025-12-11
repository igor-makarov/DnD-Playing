import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import AttackDamageCell from "./AttackDamageCell";

export type { Props } from "./AttackDamageCell";

const AttackDamageCellServer: React.FC<React.ComponentProps<typeof AttackDamageCell>> = withAutoRehydration(AttackDamageCell);
export default AttackDamageCellServer;

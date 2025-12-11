import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import WeaponAttackTable from "./WeaponAttackTable";

export type { Props } from "./WeaponAttackTable";

const WeaponAttackTableServer: React.FC<React.ComponentProps<typeof WeaponAttackTable>> = withAutoRehydration(WeaponAttackTable);
export default WeaponAttackTableServer;

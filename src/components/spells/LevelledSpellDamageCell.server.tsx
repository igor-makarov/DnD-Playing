import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import LevelledSpellDamageCell from "./LevelledSpellDamageCell";

export type { Props } from "./LevelledSpellDamageCell";

const LevelledSpellDamageCellServer: React.FC<React.ComponentProps<typeof LevelledSpellDamageCell>> = withAutoRehydration(LevelledSpellDamageCell);
export default LevelledSpellDamageCellServer;

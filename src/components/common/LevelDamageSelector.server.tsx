import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import LevelDamageSelector from "./LevelDamageSelector";

export type { Props } from "./LevelDamageSelector";

const LevelDamageSelectorServer: React.FC<React.ComponentProps<typeof LevelDamageSelector>> = withAutoRehydration(LevelDamageSelector);
export default LevelDamageSelectorServer;

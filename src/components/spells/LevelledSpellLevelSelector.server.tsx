import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import LevelledSpellLevelSelector from "./LevelledSpellLevelSelector";

export type { Props } from "./LevelledSpellLevelSelector";

const LevelledSpellLevelSelectorServer: React.FC<React.ComponentProps<typeof LevelledSpellLevelSelector>> =
  withAutoRehydration(LevelledSpellLevelSelector);
export default LevelledSpellLevelSelectorServer;

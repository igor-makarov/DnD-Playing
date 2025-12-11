import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import HitDiceTable from "./HitDiceTable";

export type { Props } from "./HitDiceTable";

const HitDiceTableServer: React.FC<React.ComponentProps<typeof HitDiceTable>> = withAutoRehydration(HitDiceTable);
export default HitDiceTableServer;

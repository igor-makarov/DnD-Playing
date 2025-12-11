import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import D20TestCell from "./D20TestCell";

export type { Props } from "./D20TestCell";

const D20TestCellServer: React.FC<React.ComponentProps<typeof D20TestCell>> = withAutoRehydration(D20TestCell);
export default D20TestCellServer;

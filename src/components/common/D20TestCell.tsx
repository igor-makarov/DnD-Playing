import { D20Test } from "@/js/common/D20Test";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import D20TestCellClient from "./D20TestCell.client";

export interface Props {
  roll: D20Test;
  advantage?: boolean;
}

const D20TestCell: React.FC<Props> = withAutoRehydration(D20TestCellClient);
export default D20TestCell;

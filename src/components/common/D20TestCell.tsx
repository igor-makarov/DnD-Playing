import { D20Test } from "@/js/common/D20Test";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

import D20TestCellClient from "./D20TestCellClient";

interface Props {
  roll: D20Test;
  advantage?: boolean;
}

export default withAutoRehydration(D20TestCellClient);

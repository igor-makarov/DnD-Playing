import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import HitPointsInput from "./HitPointsInput";

export type { Props } from "./HitPointsInput";

const HitPointsInputServer: React.FC<React.ComponentProps<typeof HitPointsInput>> = withAutoRehydration(HitPointsInput);
export default HitPointsInputServer;

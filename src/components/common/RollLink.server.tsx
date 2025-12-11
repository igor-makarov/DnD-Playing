import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import RollLink from "./RollLink";

export type { Props } from "./RollLink";

const RollLinkServer: React.FC<React.ComponentProps<typeof RollLink>> = withAutoRehydration(RollLink);
export default RollLinkServer;

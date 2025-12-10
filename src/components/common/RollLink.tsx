import React from "react";

import { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import RollLinkClient from "./RollLink.client";

export interface Props {
  dice: DiceString;
  advantage?: boolean;
  disadvantage?: boolean;
  critical?: boolean;
  title?: string;
  children?: React.ReactNode;
}

const RollLink: React.FC<Props> = withAutoRehydration(RollLinkClient);
export default RollLink;

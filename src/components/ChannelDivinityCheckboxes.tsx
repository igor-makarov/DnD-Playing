import React from "react";

import { useCharacterDynamicState } from "../js/hooks/useCharacterDynamicState";
import CheckboxUsesRow from "./common/CheckboxUsesRow";

interface Props {
  maxUses: number;
}

export default function ChannelDivinityCheckboxes({ maxUses }: Props) {
  const [used, setUsed] = useCharacterDynamicState().useChannelDivinityUsed;

  const currentUsed = used ?? 0;

  const handleChange = (newCount: number) => {
    setUsed(newCount > 0 ? newCount : undefined);
  };

  return (
    <span>
      <CheckboxUsesRow maxUses={maxUses} currentUsed={currentUsed} onChange={handleChange} /> short/long rest
    </span>
  );
}

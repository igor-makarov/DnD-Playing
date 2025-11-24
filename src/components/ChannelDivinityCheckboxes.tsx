import { useStore } from "@nanostores/react";

import React from "react";

import { $channelDivinityUsed } from "@/js/character/dynamic-state/stores";

import CheckboxUsesRow from "./common/CheckboxUsesRow";

interface Props {
  maxUses: number;
}

export default function ChannelDivinityCheckboxes({ maxUses }: Props) {
  const used = useStore($channelDivinityUsed);

  const currentUsed = used ?? 0;

  const handleChange = (newCount: number) => {
    $channelDivinityUsed.set(newCount > 0 ? newCount : undefined);
  };

  return (
    <span>
      <CheckboxUsesRow maxUses={maxUses} currentUsed={currentUsed} onChange={handleChange} /> short/long rest
    </span>
  );
}

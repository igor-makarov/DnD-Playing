"use client";
import React from "react";

import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import { $channelDivinityUsed } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

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

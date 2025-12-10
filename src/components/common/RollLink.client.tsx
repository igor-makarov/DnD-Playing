"use client";
import React from "react";

import { useStore } from "@/js/hooks/useStore";
import { $rollModeStore } from "@/js/stores/rollModeStore";
import { getRollUrl } from "@/js/utils/rollOptions";

import { Props } from "./RollLink";

export default function RollLinkClient({ dice, advantage = false, disadvantage = false, critical = false, title, children }: Props) {
  const rollMode = useStore($rollModeStore);

  // If critical is true, use the crit version of the dice
  const effectiveDice = critical ? dice.crit() : dice;

  // Generate the URL with the appropriate options
  const url = getRollUrl(effectiveDice, rollMode, {
    advantage,
    disadvantage,
  });

  return (
    <a className="dice-roll mono" href={url} title={title}>
      {children ?? `[${effectiveDice.toString()}]`}
    </a>
  );
}

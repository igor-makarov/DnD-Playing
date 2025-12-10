"use client";
import React from "react";

import HitDiceRow from "@/components/HitDiceRow";

import type { Props } from "./HitDiceTable";

export default function HitDiceTableClient({ hitDice, conModifier }: Props) {
  if (hitDice.length === 0) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: "center" }} colSpan={2}>
            Hit Dice
          </th>
        </tr>
        <tr>
          <th>Used</th>
          <th className="modifier">Die</th>
        </tr>
      </thead>
      <tbody>
        {hitDice.map(({ die, count }) => (
          <HitDiceRow key={die.toString()} die={die} count={count} conModifier={conModifier} />
        ))}
      </tbody>
    </table>
  );
}

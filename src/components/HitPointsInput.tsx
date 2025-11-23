import React, { useState } from "react";

import { useCharacterDynamicState } from "../hooks/useCharacterDynamicState";

interface Props {
  maxHP: number;
}

export default function HitPointsInput({ maxHP }: Props) {
  const { hitPointsSpent, finishLongRest } = useCharacterDynamicState();
  const [remainingHP, setRemainingHP] = hitPointsSpent;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const currentHP = remainingHP ?? maxHP;
  const displayValue = isEditing ? inputValue : currentHP.toString();

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(currentHP.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newHP = processInput();
      // Keep focus after Enter, update inputValue to show new HP
      setInputValue(newHP.toString());
    } else if (e.key === "Escape") {
      setIsEditing(false);
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => {
    processInput();
    setIsEditing(false);
  };

  const processInput = (): number => {
    const trimmed = inputValue.replace(/\s+/g, ""); // Remove all spaces

    // Empty input resets to full HP
    if (trimmed === "") {
      setRemainingHP(undefined);
      return maxHP;
    }

    // Check for illegal characters (anything that's not 0-9, +, or -)
    if (/[^0-9+\-]/.test(trimmed)) {
      // Illegal input - revert to current HP (do nothing)
      return currentHP;
    }

    // Try to evaluate as arithmetic expression
    // Match pattern: number followed by any number of (+/- number) operations
    const exprMatch = trimmed.match(/^(\d+)((?:[+\-]\d+)+)$/);
    if (exprMatch) {
      let result = parseInt(exprMatch[1], 10);
      const operations = exprMatch[2];

      // Parse and apply each operation
      const opRegex = /([+\-])(\d+)/g;
      let match;
      while ((match = opRegex.exec(operations)) !== null) {
        const operator = match[1];
        const operand = parseInt(match[2], 10);
        result = operator === "+" ? result + operand : result - operand;
      }

      return updateHP(result);
    }

    // Otherwise treat as direct number
    const numValue = parseInt(trimmed, 10);
    if (!isNaN(numValue)) {
      return updateHP(numValue);
    }
    // If invalid format, just discard the input (current HP remains unchanged)
    return currentHP;
  };

  const updateHP = (value: number): number => {
    // Clamp between 0 and maxHP
    const clampedValue = Math.max(0, Math.min(maxHP, value));

    if (clampedValue === maxHP) {
      setRemainingHP(undefined);
    } else {
      setRemainingHP(clampedValue);
    }

    return clampedValue;
  };

  return (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <span style={{ flex: 1 }} />
      <span className="mono">
        <input type="text" value={displayValue} onFocus={handleFocus} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        &nbsp;/&nbsp;
        {maxHP}
      </span>
      <span style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={finishLongRest}>Long Rest</button>
      </span>
    </span>
  );
}

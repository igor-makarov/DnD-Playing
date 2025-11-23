import React, { useState } from "react";

interface Props {
  maximum: number;
  current: number | undefined;
  onChange: (current: number | undefined) => void;
}

export default function PointsCountInput({ maximum, current, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const currentValue = current ?? maximum;
  const displayValue = isEditing ? inputValue : currentValue.toString();

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(currentValue.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newValue = processInput();
      // Keep focus after Enter, update inputValue to show new value
      setInputValue(newValue.toString());
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

    // Empty input resets to maximum
    if (trimmed === "") {
      onChange(undefined);
      return maximum;
    }

    // Check for illegal characters (anything that's not 0-9, +, or -)
    if (/[^0-9+\-]/.test(trimmed)) {
      // Illegal input - revert to current value (do nothing)
      return currentValue;
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

      return updateValue(result);
    }

    // Otherwise treat as direct number
    const numValue = parseInt(trimmed, 10);
    if (!isNaN(numValue)) {
      return updateValue(numValue);
    }
    // If invalid format, just discard the input (current value remains unchanged)
    return currentValue;
  };

  const updateValue = (value: number): number => {
    // Clamp between 0 and max
    const clampedValue = Math.max(0, Math.min(maximum, value));

    if (clampedValue === maximum) {
      onChange(undefined);
    } else {
      onChange(clampedValue);
    }

    return clampedValue;
  };

  return <input type="text" value={displayValue} onFocus={handleFocus} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />;
}

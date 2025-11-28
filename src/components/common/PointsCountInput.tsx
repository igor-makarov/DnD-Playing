import React, { useState } from "react";

import { useIsServerSideRender } from "@/js/hooks/useIsServerSideRender";
import { calculateNewPoints } from "@/js/utils/calculatePoints";

interface Props {
  current: number | undefined;
  defaultValue: number;
  maximum?: number;
  onChange: (current: number | undefined) => void;
  "data-testid"?: string;
  className?: string; // Add className prop
}

export default function PointsCountInput({ current, defaultValue, maximum, onChange, "data-testid": testId, className }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const isServerSideRender = useIsServerSideRender();

  const currentValue = current ?? defaultValue;

  const displayValue = isServerSideRender
    ? "" // Server-side render: render empty
    : isEditing
      ? inputValue // User is editing: show raw input
      : currentValue.toString(); // Not editing: show current value

  const handleFocus = () => {
    setIsEditing(true);
    setInputValue(currentValue.toString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newValue = calculateNewPoints(inputValue, currentValue, { defaultValue, maximum });

      if (newValue === defaultValue) {
        onChange(undefined);
      } else {
        onChange(newValue);
      }

      // Keep focus after Enter, update inputValue to show new value
      setInputValue(newValue.toString());
    } else if (e.key === "Escape") {
      setIsEditing(false);
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => {
    const newValue = calculateNewPoints(inputValue, currentValue, { defaultValue, maximum });

    if (newValue === defaultValue) {
      onChange(undefined);
    } else {
      onChange(newValue);
    }

    setIsEditing(false);
  };

  return (
    <input
      type="text"
      value={displayValue}
      onFocus={handleFocus}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      data-testid={testId}
      className={className} // Pass className here
    />
  );
}

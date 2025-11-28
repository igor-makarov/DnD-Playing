import React, { useState } from "react";

import { useIsServerSideRender } from "@/js/hooks/useIsServerSideRender";
import { calculateNewPoints } from "@/js/utils/calculatePoints";

interface Props {
  maximum: number;
  current: number | undefined;
  onChange: (current: number | undefined) => void;
}

export default function PointsCountInput({ maximum, current, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const isServerSideRender = useIsServerSideRender();

  const currentValue = current ?? maximum;

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
      const newValue = calculateNewPoints(inputValue, currentValue, maximum, onChange);
      // Keep focus after Enter, update inputValue to show new value
      setInputValue(newValue.toString());
    } else if (e.key === "Escape") {
      setIsEditing(false);
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => {
    calculateNewPoints(inputValue, currentValue, maximum, onChange);
    setIsEditing(false);
  };

  return <input type="text" value={displayValue} onFocus={handleFocus} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />;
}

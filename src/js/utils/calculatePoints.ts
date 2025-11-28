type OnChange = (current: number | undefined) => void;

export function calculateNewPoints(inputValue: string, currentValue: number, maximum: number, onChange: OnChange): number {
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
}

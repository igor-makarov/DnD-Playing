interface CalculateNewPointsOptions {
  defaultValue: number;
  maximum?: number;
}

export function calculateNewPoints(inputValue: string, currentValue: number, options: CalculateNewPointsOptions): number {
  const { defaultValue, maximum } = options;

  const updateValue = (value: number): number => {
    // Clamp between 0 and maximum (if provided), or defaultValue
    const lowerClampedValue = Math.max(0, value);
    const clampedValue = maximum === undefined ? lowerClampedValue : Math.min(maximum, lowerClampedValue);

    return clampedValue;
  };

  const trimmed = inputValue.replace(/\s+/g, ""); // Remove all spaces

  // Empty input resets to defaultValue (or 0 if maximum is not provided and current value is 0)
  if (trimmed === "") {
    if (maximum === undefined && currentValue === 0) {
      return 0; // If no maximum and currently 0, keep 0
    }
    return defaultValue;
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

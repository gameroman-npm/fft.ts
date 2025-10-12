import type { ComplexNumber } from "./types";

/**
 * Add two complex numbers
 */
function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return [a[0] + b[0], a[1] + b[1]];
}

/**
 * Subtract two complex numbers
 */
function complexSubtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return [a[0] - b[0], a[1] - b[1]];
}

/**
 * Multiply two complex numbers
 *
 * `(a + bi) * (c + di) = (ac - bd) + (ad + bc)i`
 */
function complexMultiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

/**
 * Calculate `|a + bi|`
 *
 * `sqrt(a*a + b*b)`
 */
function complexMagnitude(c: ComplexNumber): number {
  return Math.sqrt(c[0] * c[0] + c[1] * c[1]);
}

export {
  complexAdd as add,
  complexSubtract as subtract,
  complexMultiply as multiply,
  complexMagnitude as magnitude,
};

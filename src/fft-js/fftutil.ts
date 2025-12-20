import type { ComplexNumber } from "./types";

const mapExponent: Record<number, Record<number, ComplexNumber>> = {};

/**
 * By Eulers Formula:
 *
 * `e^(i*x) = cos(x) + i*sin(x)`
 *
 * and in DFT:
 *
 * `x = -2 * PI * (k/N)`
 */
function exponent(k: number, N: number): ComplexNumber {
  const x = -2 * Math.PI * (k / N);

  mapExponent[N] = mapExponent[N] || {};
  mapExponent[N][k] = mapExponent[N][k] || [Math.cos(x), Math.sin(x)]; // [Real, Imaginary]

  return mapExponent[N][k];
}

export { exponent };

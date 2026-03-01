import * as complex from "./complex";
import * as fftUtil from "./fftutil";
import type { ComplexNumber } from "./types";

/**
 * Calculate brute-force O(n^2) DFT for vector.
 */
function dft(vector: (ComplexNumber | number)[]): ComplexNumber[] {
  const X: ComplexNumber[] = [];
  const N = vector.length;

  for (let k = 0; k < N; k++) {
    X[k] = [0, 0]; // Initialize to a 0-valued complex number.

    for (let i = 0; i < N; i++) {
      const exp = fftUtil.exponent(k * i, N);
      let term: ComplexNumber;
      const vector_i = vector[i]!;
      if (Array.isArray(vector_i)) term = complex.multiply(vector_i, exp);
      // If input vector contains complex numbers
      else term = complex.multiply([vector_i, 0], exp); // Complex mult of the signal with the exponential term.
      X[k] = complex.add(X[k]!, term); // Complex summation of X[k] and exponential
    }
  }

  return X;
}

export default dft;

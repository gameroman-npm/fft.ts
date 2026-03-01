import * as complex from "./complex";
import * as fftUtil from "./fftutil";
import * as twiddle from "./twiddle";
import type { ComplexNumber, Vector } from "./types";

/**
 * Calculate FFT for vector where `vector.length`
 * is assumed to be a power of 2.
 */
function fft(vector: Vector): ComplexNumber[] {
  const X: ComplexNumber[] = [];
  const N = vector.length;

  // Base case is X = x + 0i since our input is assumed to be real only.
  if (N == 1) {
    const vector_0 = vector[0]!;
    if (Array.isArray(vector_0))
      // If input vector contains complex numbers
      return [[vector_0[0], vector_0[1]]];
    else return [[vector_0, 0]];
  }

  // Recurse: all even samples
  const X_evens = fft(
    vector.filter(function even(__, ix) {
      return ix % 2 == 0;
    }),
  );

  // Recurse: all odd samples
  const X_odds = fft(
    vector.filter(function odd(__, ix) {
      return ix % 2 == 1;
    }),
  );

  // Now, perform N/2 operations!
  for (let k = 0; k < N / 2; k++) {
    // t is a complex number!
    const t = X_evens[k]!;
    const e = complex.multiply(fftUtil.exponent(k, N), X_odds[k]!);

    X[k] = complex.add(t, e);
    X[k + N / 2] = complex.subtract(t, e);
  }

  return X;
}

/**
 * Calculate FFT for vector where `vector.length`
 * is assumed to be a power of `2`.
 *
 * This is the in-place implementation
 * to avoid the memory footprint used by recursion.
 */
function fftInPlace(vector: number[]): ComplexNumber[] {
  const vector_: (number | ComplexNumber)[] = vector;
  const N = vector_.length;

  const trailingZeros = twiddle.countTrailingZeros(N); // Once reversed, this will be leading zeros

  // Reverse bits
  for (let k = 0; k < N; k++) {
    const p = twiddle.reverse(k) >>> (twiddle.INT_BITS - trailingZeros);
    if (p > k) {
      const complexTemp: ComplexNumber = [vector_[k] as number, 0];
      vector_[k] = vector_[p]!;
      vector_[p] = complexTemp;
    } else {
      vector_[p] = [vector_[p] as number, 0];
    }
  }

  const vector__ = vector_ as ComplexNumber[];

  // Do the DIT now in-place
  for (let len = 2; len <= N; len += len) {
    for (let i = 0; i < len / 2; i++) {
      const w = fftUtil.exponent(i, len);
      for (let j = 0; j < N / len; j++) {
        const t = complex.multiply(w, vector__[j * len + i + len / 2]!);
        vector__[j * len + i + len / 2] = complex.subtract(
          vector__[j * len + i]!,
          t,
        );
        vector__[j * len + i] = complex.add(vector__[j * len + i]!, t);
      }
    }
  }

  return vector__;
}

export { fft, fftInPlace };

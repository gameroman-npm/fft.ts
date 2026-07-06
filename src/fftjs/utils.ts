import type { ComplexNumber, ComplexSignal, Signal } from "./types";

// memoization of the reversal of different lengths.
const memoizedReversal: Record<number, Record<number, number>> = {};
const memoizedZeroBuffers: Record<number, number[]> = {};

function constructComplexArray(signal: Signal): ComplexSignal {
  const real = signal.real === undefined ? signal.slice() : signal.real.slice();

  const bufferSize = real.length;

  if (memoizedZeroBuffers[bufferSize] === undefined) {
    memoizedZeroBuffers[bufferSize] = Array<number>(bufferSize).fill(0);
  }

  const imag = memoizedZeroBuffers[bufferSize].slice();

  return { real, imag };
}

function bitReverseArray(n: number): Record<number, number> {
  const memo = memoizedReversal[n];
  if (memo) return memo;

  const width = 32 - Math.clz32(n - 1);
  const reversed: Record<number, number> = {};

  for (let i = 0; i < n; i++) {
    let orig = i;
    let rev = 0;

    for (let j = 0; j < width; j++) {
      // Push rev left, grab orig's rightmost bit
      rev = (rev << 1) | (orig & 1);
      // Shift orig right to get the next bit
      orig >>= 1;
    }

    reversed[i] = rev;
  }

  return (memoizedReversal[n] = reversed);
}

/* complex multiplication */
function multiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  };
}

/* complex addition */
function add(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    real: a.real + b.real,
    imag: a.imag + b.imag,
  };
}

/** complex subtraction */
function subtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    real: a.real - b.real,
    imag: a.imag - b.imag,
  };
}

/** euler's identity e^x = cos(x) + sin(x) */
function euler(kn: number, n: number): ComplexNumber {
  const x = (-2 * Math.PI * kn) / n;
  return { real: Math.cos(x), imag: Math.sin(x) };
}

/* complex conjugate */
function conj(a: ComplexNumber): ComplexNumber {
  a.imag *= -1;
  return a;
}

export {
  bitReverseArray,
  multiply,
  add,
  subtract,
  euler,
  conj,
  constructComplexArray,
};

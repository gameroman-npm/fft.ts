import type { ComplexNumber, ComplexSignal, Signal } from "./types";

// memoization of the reversal of different lengths.
const memoizedReversal: Record<number, Record<number, number>> = {};
const memoizedZeroBuffers: Record<number, number[]> = {};

function constructComplexArray(signal: Signal): ComplexSignal {
  const complexSignal: ComplexSignal = {};

  complexSignal.real =
    signal.real === undefined ? signal.slice() : signal.real.slice();

  const bufferSize = complexSignal.real.length;

  if (memoizedZeroBuffers[bufferSize] === undefined) {
    memoizedZeroBuffers[bufferSize] = Array.apply(null, Array(bufferSize)).map(
      Number.prototype.valueOf,
      0
    );
  }

  complexSignal.imag = memoizedZeroBuffers[bufferSize].slice();

  return complexSignal;
}

function bitReverseArray(n: number): Record<number, number> {
  if (memoizedReversal[n] === undefined) {
    const maxBinaryLength = (n - 1).toString(2).length; //get the binary length of the largest index.
    const templateBinary = "0".repeat(maxBinaryLength); //create a template binary of that length.
    const reversed: Record<number, number> = {};
    for (let i = 0; i < n; i++) {
      let currBinary = i.toString(2); //get binary value of current index.

      //prepend zeros from template to current binary. This makes binary values of all indices have the same length.
      currBinary = templateBinary.substr(currBinary.length) + currBinary;

      currBinary = [...currBinary].reverse().join(""); // reverse
      reversed[i] = parseInt(currBinary, 2); // convert to decimal
    }
    memoizedReversal[n] = reversed; // save
  }
  return memoizedReversal[n];
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

import type { ComplexNumber, ComplexSignal, Signal } from "./types";
import * as utils from "./utils";

// real to complex fft
function fft(signal: Signal): ComplexSignal {
  let complexSignal: ComplexSignal = {};

  if (signal.real === undefined || signal.imag === undefined) {
    complexSignal = utils.constructComplexArray(signal);
  } else {
    complexSignal.real = signal.real.slice();
    complexSignal.imag = signal.imag.slice();
  }

  const n = complexSignal.real.length;
  const logN = Math.log2(n);

  if (Math.round(logN) != logN)
    throw new Error("Input size must be a power of 2.");

  if (complexSignal.real.length != complexSignal.imag.length) {
    throw new Error("Real and imaginary components must have the same length.");
  }

  const bitReversedIndices = utils.bitReverseArray(n);

  // sort array
  const ordered = {
    real: [],
    imag: [],
  };

  for (let i = 0; i < n; i++) {
    ordered.real[bitReversedIndices[i]] = complexSignal.real[i];
    ordered.imag[bitReversedIndices[i]] = complexSignal.imag[i];
  }

  for (let i = 0; i < n; i++) {
    complexSignal.real[i] = ordered.real[i];
    complexSignal.imag[i] = ordered.imag[i];
  }
  // iterate over the number of stages
  for (let n = 1; n <= logN; n++) {
    const currN = Math.pow(2, n);

    // find twiddle factors
    for (let k = 0; k < currN / 2; k++) {
      const twiddle = utils.euler(k, currN);

      // on each block of FT, implement the butterfly diagram
      for (let m = 0; m < n / currN; m++) {
        const currEvenIndex = currN * m + k;
        const currOddIndex = currN * m + k + currN / 2;

        const currEvenIndexSample: ComplexNumber = {
          real: complexSignal.real[currEvenIndex],
          imag: complexSignal.imag[currEvenIndex],
        };
        const currOddIndexSample: ComplexNumber = {
          real: complexSignal.real[currOddIndex],
          imag: complexSignal.imag[currOddIndex],
        };

        const odd = utils.multiply(twiddle, currOddIndexSample);

        const subtractionResult = utils.subtract(currEvenIndexSample, odd);
        complexSignal.real[currOddIndex] = subtractionResult.real;
        complexSignal.imag[currOddIndex] = subtractionResult.imag;

        const additionResult = utils.add(odd, currEvenIndexSample);
        complexSignal.real[currEvenIndex] = additionResult.real;
        complexSignal.imag[currEvenIndex] = additionResult.imag;
      }
    }
  }

  return complexSignal;
}

// complex to real ifft
function ifft(signal: ComplexSignal): ComplexSignal {
  if (signal.real === undefined || signal.imag === undefined) {
    throw new Error("IFFT only accepts a complex input.");
  }

  const n = signal.real.length;

  const complexSignal: ComplexSignal = {
    real: [],
    imag: [],
  };

  //take complex conjugate in order to be able to use the regular FFT for IFFT
  for (let i = 0; i < n; i++) {
    const currentSample: ComplexNumber = {
      real: signal.real[i],
      imag: signal.imag[i],
    };

    const conjugateSample = utils.conj(currentSample);
    complexSignal.real[i] = conjugateSample.real;
    complexSignal.imag[i] = conjugateSample.imag;
  }

  // compute
  const x = fft(complexSignal);

  // normalize
  complexSignal.real = x.real.map((val) => {
    return val / n;
  });

  complexSignal.imag = x.imag.map((val) => {
    return val / n;
  });

  return complexSignal;
}

export { fft, ifft };

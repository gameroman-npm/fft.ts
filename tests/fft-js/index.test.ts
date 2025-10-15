import { describe, it, expect } from "bun:test";

import assert from "node:assert";

import { fft, ifft, fftInPlace, dft, idft, type ComplexNumber } from "~/fft-js";

const THRESHOLD_DIGITS = 9;

describe("FFT (Cooley-Tukey)", function () {
  describe("1,0,1,0", function () {
    it("Should properly compute [1,0,1,0]", function () {
      const coef = fft([1, 0, 1, 0]);
      checkShortVectorWithThresh(coef);
    });
  });

  describe("1,0,1,0,2,0,2,0", function () {
    it("Should properly compute [1,0,1,0,2,0,2,0]", function () {
      const coef = fft([1, 0, 1, 0, 2, 0, 2, 0]);
      checkLongVectorWithThresh(coef);
    });
  });
});

describe("IFFT (Cooley-Tukey)", function () {
  describe("1,0,1,0", function () {
    it("Should properly compute [1,0,1,0]", function () {
      const coef = ifft([
        [1, 0],
        [0, 0],
        [1, 0],
        [0, 0],
      ]);
      checkShortVectorWithThreshIfft(coef);
    });
  });

  describe("1,0,1,0,2,0,2,0", function () {
    it("Should properly compute [1,0,1,0,2,0,2,0]", function () {
      const coef = ifft([
        [1, 0],
        [0, 0],
        [1, 0],
        [0, 0],
        [2, 0],
        [0, 0],
        [2, 0],
        [0, 0],
      ]);
      checkLongVectorWithThreshIfft(coef);
    });
  });
});

describe("FFT (in-place Cooley-Tukey)", function () {
  describe("1,0,1,0", function () {
    it("Should properly compute [1,0,1,0]", function () {
      const vector_ = [1, 0, 1, 0];
      const vector = fftInPlace(vector_);
      checkShortVectorWithThresh(vector);
    });
  });

  describe("1,0,1,0,2,0,2,0", function () {
    it("Should properly compute [1,0,1,0,2,0,2,0]", function () {
      const vector_ = [1, 0, 1, 0, 2, 0, 2, 0];
      const vector = fftInPlace(vector_);
      checkLongVectorWithThresh(vector);
    });
  });
});

describe("DFT O(n^2) Brute Force", function () {
  describe("1,0,1,0", function () {
    it("Should properly compute [1, 0, 1, 0]", function () {
      const coef = dft([1, 0, 1, 0]);
      checkShortVectorWithThresh(coef);
    });
  });
});

describe("IDFT O(n^2) Brute Force", function () {
  describe("1,0,1,0", function () {
    it("Should properly compute [1, 0, 1, 0]", function () {
      const coef = idft([
        [1, 0],
        [0, 0],
        [1, 0],
        [0, 0],
      ]);
      checkShortVectorWithThreshIfft(coef);
    });
  });

  describe("1,0,1,0,2,0,2,0", function () {
    it("Should properly compute [1,0,1,0,2,0,2,0]", function () {
      const coef = idft([
        [1, 0],
        [0, 0],
        [1, 0],
        [0, 0],
        [2, 0],
        [0, 0],
        [2, 0],
        [0, 0],
      ]);
      checkLongVectorWithThreshIfft(coef);
    });
  });
});

describe("Compare FFT to DFT", function () {
  const randomSignal = signalVector();
  let coefFFT: ComplexNumber[];
  let vectorInPlace: ComplexNumber[];
  let coefDFT: ComplexNumber[];

  describe("randomSignal FFT", function () {
    it("Should compute randomSignal", function () {
      coefFFT = fft(randomSignal);
      assert(coefFFT && coefFFT.length == randomSignal.length);
    });
  });
  describe("randomSignal in-place FFT", function () {
    it("Should compute randomSignal", function () {
      const vectorInPlace_ = randomSignal.slice(); // We must copy the original, since the in-place implementation is destructive of the input vector.
      vectorInPlace = fftInPlace(vectorInPlace_);
      assert(vectorInPlace && vectorInPlace.length == randomSignal.length);
    });
  });
  describe("randomSignal DFT", function () {
    it("Should compute randomSignal", function () {
      coefDFT = dft(randomSignal);
      assert(coefDFT && coefDFT.length == randomSignal.length);
    });
  });
  describe("randomSignal FFT and DFT", function () {
    it("Should compute same output", function () {
      // Loop over all elements in the two output arrays
      for (let i = 0; i < randomSignal.length; i++) {
        // Check that they are equal within reason
        expectEqualWithThresh(coefFFT[i]![0], coefDFT[i]![0]);
        expectEqualWithThresh(coefFFT[i]![1], coefDFT[i]![1]);
      }
    });
  });
  describe("randomSignal in-place FFT and DFT", function () {
    it("Should compute same output", function () {
      // Loop over all elements for the in-place FFT and DFT this time
      for (let k = 0; k < randomSignal.length; k++) {
        expectEqualWithThresh(vectorInPlace[k]![0], coefDFT[k]![0]);
        expectEqualWithThresh(vectorInPlace[k]![1], coefDFT[k]![1]);
      }
    });
  });
});

function signalVector(vectorLength?: number): number[] {
  vectorLength = vectorLength || 16;
  const vector: number[] = [];

  for (let i = 0; i < vectorLength; i++) {
    vector[i] = Math.random();
  }

  return vector;
}

function expectEqualWithThresh(val1: number, val2: number) {
  expect(val1).toBeCloseTo(val2, THRESHOLD_DIGITS);
}

function checkWithExpected(coef: ComplexNumber[], expected: ComplexNumber[]) {
  for (let i = 0; i < expected.length; i++) {
    expectEqualWithThresh(coef[i]![0], expected[i]![0]);
    expectEqualWithThresh(coef[i]![1], expected[i]![1]);
  }
}

function checkShortVectorWithThresh(coef: [number, number][]) {
  checkWithExpected(coef, [
    [2, 0],
    [0, 0],
    [2, 0],
    [0, 0],
  ]);
}

function checkLongVectorWithThresh(coef: [number, number][]) {
  checkWithExpected(coef, [
    [6, 0],
    [-1, 1],
    [0, 0],
    [-1, -1],
    [6, 0],
    [-1, 1],
    [0, 0],
    [-1, -1],
  ]);
}

function checkShortVectorWithThreshIfft(coef: [number, number][]) {
  checkWithExpected(coef, [
    [0.5, 0],
    [0, 0],
    [0.5, 0],
    [0, 0],
  ]);
}

function checkLongVectorWithThreshIfft(coef: [number, number][]) {
  checkWithExpected(coef, [
    [0.75, 0],
    [-0.125, -0.125],
    [0, 0],
    [-0.125, 0.125],
    [0.75, 0],
    [-0.125, -0.125],
    [0, 0],
    [-0.125, 0.125],
  ]);
}

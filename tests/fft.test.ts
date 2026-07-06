import { describe, it, expect } from "bun:test";

import { fft, ifft } from "fft.ts";
import type { FFTResult } from "fft.ts";

function expectFFTClose(
  actual: FFTResult,
  expected: { real: number[]; imag: number[] },
  precision = 9,
) {
  for (let i = 0; i < expected.real.length; i++) {
    expect(actual.real[i]).toBeCloseTo(expected.real[i]!, precision);
    expect(actual.imag[i]).toBeCloseTo(expected.imag[i]!, precision);
  }
}

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.random() * 2 - 1);
}

function rmsError(
  actual: FFTResult,
  expected: { real: number[]; imag: number[] },
): number {
  const n = actual.real.length;
  let err = 0;
  for (let i = 0; i < n; i++) {
    const dr = actual.real[i]! - expected.real[i]!;
    const di = actual.imag[i]! - expected.imag[i]!;
    err += dr * dr + di * di;
  }
  return Math.sqrt(err / n);
}

describe("fft", () => {
  describe("known vectors", () => {
    it("n=2, input=[1,2]", () => {
      const result = fft([1, 2], [0, 0]);
      expectFFTClose(result, {
        real: [3, -1],
        imag: [0, 0],
      });
    });

    it("n=4, input=[1,0,0,0]", () => {
      const result = fft([1, 0, 0, 0], [0, 0, 0, 0]);
      expectFFTClose(result, {
        real: [1, 1, 1, 1],
        imag: [0, 0, 0, 0],
      });
    });

    it("n=4, input=[1,0,1,0]", () => {
      const result = fft([1, 0, 1, 0], [0, 0, 0, 0]);
      expectFFTClose(result, {
        real: [2, 0, 2, 0],
        imag: [0, 0, 0, 0],
      });
    });

    it("n=8, input=[1,0,1,0,2,0,2,0]", () => {
      const result = fft([1, 0, 1, 0, 2, 0, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0]);
      expectFFTClose(result, {
        real: [6, -1, 0, -1, 6, -1, 0, -1],
        imag: [0, 1, 0, -1, 0, 1, 0, -1],
      });
    });

    it("n=3 (non-power-of-2), input=[1,2,3]", () => {
      const result = fft([1, 2, 3], [0, 0, 0]);
      expectFFTClose(result, {
        real: [6, -1.5, -1.5],
        imag: [0, 0.8660254037844386, -0.8660254037844386],
      });
    });

    it("n=5 (non-power-of-2), input=[1,2,3,4,5]", () => {
      const result = fft([1, 2, 3, 4, 5], [0, 0, 0, 0, 0]);
      expectFFTClose(result, {
        real: [15, -2.5, -2.5, -2.5, -2.5],
        imag: [
          0, 3.440954801178, 0.812299240582, -0.812299240582, -3.440954801178,
        ],
      });
    });

    it("n=6 (non-power-of-2), input=[1,2,3,4,5,6]", () => {
      const result = fft([1, 2, 3, 4, 5, 6], [0, 0, 0, 0, 0, 0]);
      expectFFTClose(result, {
        real: [21, -3, -3, -3, -3, -3],
        imag: [
          0, 5.196152422707, 1.732050807569, 0, -1.732050807569,
          -5.196152422707,
        ],
      });
    });
  });

  describe("round-trip (fft + ifft === identity)", () => {
    const powerOfTwo = [
      1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096,
    ];
    for (const n of powerOfTwo) {
      it(`power-of-2 size ${n}`, () => {
        const real = randomArray(n);
        const imag = randomArray(n);
        const fwd = fft(real, imag);
        const back = ifft(fwd.real, fwd.imag);
        expect(rmsError(back, { real, imag })).toBeLessThan(1e-10);
      });
    }

    const nonPowerOfTwo = [
      3, 5, 6, 7, 9, 10, 11, 12, 13, 25, 27, 50, 51, 99, 100, 101,
    ];
    for (const n of nonPowerOfTwo) {
      it(`non-power-of-2 size ${n}`, () => {
        const real = randomArray(n);
        const imag = randomArray(n);
        const fwd = fft(real, imag);
        const back = ifft(fwd.real, fwd.imag);
        expect(rmsError(back, { real, imag })).toBeLessThan(1e-10);
      });
    }
  });

  it("should not mutate input arrays", () => {
    const real = [1, 0, 1, 0];
    const imag = [0, 0, 0, 0];
    const originalReal = [...real];
    const originalImag = [...imag];
    fft(real, imag);
    expect(real).toEqual(originalReal);
    expect(imag).toEqual(originalImag);
  });

  it("should handle size 0", () => {
    const result = fft([], []);
    expect(result.real).toEqual([]);
    expect(result.imag).toEqual([]);
  });

  it("should handle size 1", () => {
    const result = fft([3], [4]);
    expectFFTClose(result, { real: [3], imag: [4] });
  });
});

describe("ifft", () => {
  it("should round-trip with fft for known vector", () => {
    const real = [1, 0, 1, 0];
    const imag = [0, 0, 0, 0];
    const fwd = fft(real, imag);
    const back = ifft(fwd.real, fwd.imag);
    expectFFTClose(back, { real, imag }, 10);
  });

  it("should not mutate input arrays", () => {
    const real = [2, 0, 2, 0];
    const imag = [0, 0, 0, 0];
    const originalReal = [...real];
    const originalImag = [...imag];
    ifft(real, imag);
    expect(real).toEqual(originalReal);
    expect(imag).toEqual(originalImag);
  });
});

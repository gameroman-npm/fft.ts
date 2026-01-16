import { describe, it, expect } from "bun:test";

import { transform, inverseTransform, convolveComplex } from "../../src/nayuki";

/*---- Test functions ----*/

function testFft(size: number) {
  const inputreal = randomReals(size);
  const inputimag = randomReals(size);

  const expectreal = Array.from<number>({ length: size });
  const expectimag = Array.from<number>({ length: size });
  naiveDft(inputreal, inputimag, expectreal, expectimag, false);

  const actualreal = inputreal.slice();
  const actualimag = inputimag.slice();
  transform(actualreal, actualimag);
  let err = log10RmsErr(expectreal, expectimag, actualreal, actualimag);

  for (let i = 0; i < size; i++) {
    actualreal[i]! /= size;
    actualimag[i]! /= size;
  }
  inverseTransform(actualreal, actualimag);
  err = Math.max(
    log10RmsErr(inputreal, inputimag, actualreal, actualimag),
    err,
  );

  expect(err).toBeLessThan(-10);
}

function testConvolution(size: number) {
  const input0real = randomReals(size);
  const input0imag = randomReals(size);

  const input1real = randomReals(size);
  const input1imag = randomReals(size);

  let expectreal = Array.from<number>({ length: size });
  let expectimag = Array.from<number>({ length: size });
  naiveConvolve(
    input0real,
    input0imag,
    input1real,
    input1imag,
    expectreal,
    expectimag,
  );

  let actualreal = Array.from<number>({ length: size });
  let actualimag = Array.from<number>({ length: size });
  convolveComplex(
    input0real,
    input0imag,
    input1real,
    input1imag,
    actualreal,
    actualimag,
  );

  const err = log10RmsErr(expectreal, expectimag, actualreal, actualimag);
  expect(err).toBeLessThan(-10);
}

/*---- Naive reference computation functions ----*/

function naiveDft(
  inreal: number[],
  inimag: number[],
  outreal: number[],
  outimag: number[],
  inverse: boolean,
) {
  const n = inreal.length;
  if (n != inimag.length || n != outreal.length || n != outimag.length)
    throw new RangeError("Mismatched lengths");

  const coef = (inverse ? 2 : -2) * Math.PI;
  for (let k = 0; k < n; k++) {
    // For each output element
    let sumreal = 0;
    let sumimag = 0;
    for (let t = 0; t < n; t++) {
      // For each input element
      const angle = (coef * ((t * k) % n)) / n; // This is more accurate than t * k
      sumreal += inreal[t]! * Math.cos(angle) - inimag[t]! * Math.sin(angle);
      sumimag += inreal[t]! * Math.sin(angle) + inimag[t]! * Math.cos(angle);
    }
    outreal[k] = sumreal;
    outimag[k] = sumimag;
  }
}

function naiveConvolve(
  xreal: number[],
  ximag: number[],
  yreal: number[],
  yimag: number[],
  outreal: number[],
  outimag: number[],
) {
  const n = xreal.length;
  if (
    n != ximag.length ||
    n != yreal.length ||
    n != yimag.length ||
    n != outreal.length ||
    n != outimag.length
  )
    throw new RangeError("Mismatched lengths");

  for (let i = 0; i < n; i++) {
    outreal[i] = 0;
    outimag[i] = 0;
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const k = (i + j) % n;
      outreal[k]! += xreal[i]! * yreal[j]! - ximag[i]! * yimag[j]!;
      outimag[k]! += xreal[i]! * yimag[j]! + ximag[i]! * yreal[j]!;
    }
  }
}

/*---- Utility functions ----*/

function log10RmsErr(
  xreal: number[],
  ximag: number[],
  yreal: number[],
  yimag: number[],
): number {
  const n = xreal.length;
  if (n != ximag.length || n != yreal.length || n != yimag.length)
    throw new RangeError("Mismatched lengths");

  let err = Math.pow(10, -99 * 2);
  for (let i = 0; i < n; i++)
    err +=
      (xreal[i]! - yreal[i]!) * (xreal[i]! - yreal[i]!) +
      (ximag[i]! - yimag[i]!) * (ximag[i]! - yimag[i]!);
  err = Math.sqrt(err / Math.max(n, 1)); // Now this is a root mean square (RMS) error
  err = Math.log(err) / Math.log(10);
  return err;
}

function randomReals(size: number): number[] {
  let result = Array.from<number>({ length: size });
  for (let i = 0; i < result.length; i++) result[i] = Math.random() * 2 - 1;
  return result;
}

/*---- Test suites ----*/

describe("FFT", () => {
  it("power-of-2 sizes", () => {
    for (let i = 0; i <= 12; i++) testFft(1 << i);
  });

  it("small sizes", () => {
    for (let i = 0; i < 30; i++) testFft(i);
  });

  it("diverse sizes", () => {
    for (let i = 0, prev = 0; i <= 100; i++) {
      const n = Math.round(Math.pow(1500, i / 100.0));
      if (n > prev) {
        testFft(n);
        prev = n;
      }
    }
  });
});

describe("Complex convolution", () => {
  it("power-of-2 sizes", () => {
    for (let i = 0; i <= 12; i++) testConvolution(1 << i);
  });

  it("diverse sizes", () => {
    for (let i = 0, prev = 0; i <= 100; i++) {
      const n = Math.round(Math.pow(1500, i / 100.0));
      if (n > prev) {
        testConvolution(n);
        prev = n;
      }
    }
  });
});

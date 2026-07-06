import { describe, it, expect } from "bun:test";

import { fftfreq, fftshift } from "fft.ts/utils";

describe("fftfreq", () => {
  it("should compute correct frequencies for n=4, freq=1", () => {
    const result = fftfreq(4, 1);
    expect(result[0]).toBeCloseTo(0, 10);
    expect(result[1]).toBeCloseTo(0.25, 10);
    expect(result[2]).toBeCloseTo(-0.5, 10);
    expect(result[3]).toBeCloseTo(-0.25, 10);
  });

  it("should compute with different frequency", () => {
    const result = fftfreq(4, 100);
    expect(result[0]).toBeCloseTo(0, 10);
    expect(result[1]).toBeCloseTo(25, 10);
    expect(result[2]).toBeCloseTo(-50, 10);
    expect(result[3]).toBeCloseTo(-25, 10);
  });

  it("should handle n=1", () => {
    const result = fftfreq(1, 1);
    expect(result[0]).toBeCloseTo(0, 10);
  });

  it("should handle n=2", () => {
    const result = fftfreq(2, 1);
    expect(result[0]).toBeCloseTo(0, 10);
    expect(result[1]).toBeCloseTo(-0.5, 10);
  });

  it("should handle n=8", () => {
    const result = fftfreq(8, 1);
    expect(result[0]).toBeCloseTo(0, 10);
    expect(result[1]).toBeCloseTo(0.125, 10);
    expect(result[2]).toBeCloseTo(0.25, 10);
    expect(result[3]).toBeCloseTo(0.375, 10);
    expect(result[4]).toBeCloseTo(-0.5, 10);
    expect(result[5]).toBeCloseTo(-0.375, 10);
    expect(result[6]).toBeCloseTo(-0.25, 10);
    expect(result[7]).toBeCloseTo(-0.125, 10);
  });
});

describe("fftshift", () => {
  it("should shift even-length array", () => {
    expect(fftshift([1, 2, 3, 4])).toEqual([3, 4, 1, 2]);
  });

  it("should shift odd-length array", () => {
    expect(fftshift([1, 2, 3, 4, 5])).toEqual([4, 5, 1, 2, 3]);
  });

  it("should shift single-element array", () => {
    expect(fftshift([1])).toEqual([1]);
  });

  it("should shift empty array", () => {
    expect(fftshift([])).toEqual([]);
  });

  it("should shift complex arrays (tuples)", () => {
    const arr: [number, number][] = [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ];
    expect(fftshift(arr)).toEqual([
      [3, 0],
      [4, 0],
      [1, 0],
      [2, 0],
    ]);
  });
});

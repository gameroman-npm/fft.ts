import { describe, it, expect } from "bun:test";

import { FFT } from "~/fft.js";

function fixRoundEqual(actual: number[], expected: number[]) {
  function fixRound(r: number) {
    return Math.round(r * 1000) / 1000;
  }

  expect(actual.map(fixRound).join(":")).toStrictEqual(
    expected.map(fixRound).join(":")
  );
}

describe("FFT.js", () => {
  it("should compute tables", () => {
    const f = new FFT(8);
    expect(f.table.length).toStrictEqual(16);
  });

  it("should throw on invalid table size", () => {
    expect(() => {
      new FFT(1);
    }).toThrow(/bigger than 1/);

    expect(() => {
      new FFT(9);
    }).toThrow(/power of two/);

    expect(() => {
      new FFT(7);
    }).toThrow(/power of two/);

    expect(() => {
      new FFT(3);
    }).toThrow(/power of two/);

    expect(() => {
      new FFT(0);
    }).toThrow(/power of two/);

    expect(() => {
      new FFT(-1);
    }).toThrow(/power of two/);
  });

  it("should create complex array", () => {
    const f = new FFT(4);

    expect(f.createComplexArray().length).toStrictEqual(8);
    expect(f.createComplexArray()[0]).toStrictEqual(0);
  });

  it("should convert to complex array", () => {
    const f = new FFT(4);

    expect(f.toComplexArray([1, 2, 3, 4])).toStrictEqual([
      1, 0, 2, 0, 3, 0, 4, 0,
    ]);
  });

  it("should convert from complex array", () => {
    const f = new FFT(4);

    expect(f.fromComplexArray(f.toComplexArray([1, 2, 3, 4]))).toStrictEqual([
      1, 2, 3, 4,
    ]);
  });

  it("should throw on invalid transform inputs", () => {
    const f = new FFT(8);
    const output = f.createComplexArray();

    expect(() => {
      f.transform(output, output);
    }).toThrow(/must be different/);
  });

  it("should transform trivial radix-2 case", () => {
    const f = new FFT(2);

    const out = f.createComplexArray();
    let data = f.toComplexArray([0.5, -0.5]);
    f.transform(out, data);
    expect(out).toStrictEqual([0, 0, 1, 0]);

    data = f.toComplexArray([0.5, 0.5]);
    f.transform(out, data);
    expect(out).toStrictEqual([1, 0, 0, 0]);

    // Linear combination
    data = f.toComplexArray([1, 0]);
    f.transform(out, data);
    expect(out).toStrictEqual([1, 0, 1, 0]);
  });

  it("should transform trivial case", () => {
    const f = new FFT(4);

    const out = f.createComplexArray();
    let data = f.toComplexArray([1, 0.707106, 0, -0.707106]);
    f.transform(out, data);
    fixRoundEqual(out, [1, 0, 1, -1.414, 1, 0, 1, 1.414]);

    data = f.toComplexArray([1, 0, -1, 0]);
    f.transform(out, data);
    expect(out).toStrictEqual([0, 0, 2, 0, 0, 0, 2, 0]);
  });

  it("should inverse-transform", () => {
    const f = new FFT(4);

    const out = f.createComplexArray();
    const data = f.toComplexArray([1, 0.707106, 0, -0.707106]);
    f.transform(out, data);
    fixRoundEqual(out, [1, 0, 1, -1.414, 1, 0, 1, 1.414]);
    f.inverseTransform(data, out);
    expect(f.fromComplexArray(data)).toStrictEqual([1, 0.707106, 0, -0.707106]);
  });

  it("should transform big recursive case", () => {
    const input = [];
    for (let i = 0; i < 256; i++) input.push(i);

    const f = new FFT(input.length);

    const out = f.createComplexArray();
    let data = f.toComplexArray(input);
    f.transform(out, data);
    f.inverseTransform(data, out);
    fixRoundEqual(f.fromComplexArray(data), input);
  });

  it("should transform big recursive radix-2 case", () => {
    const input = [];
    for (let i = 0; i < 128; i++) input.push(i);

    const f = new FFT(input.length);

    const out = f.createComplexArray();
    let data = f.toComplexArray(input);
    f.transform(out, data);
    f.inverseTransform(data, out);
    fixRoundEqual(f.fromComplexArray(data), input);
  });
});

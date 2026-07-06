import { describe, it, expect } from "bun:test";

import { FFT } from "fft.ts/fast";

describe("FFT class", () => {
  it("should compute tables", () => {
    const f = new FFT(8);
    expect(f.createComplexArray().length).toStrictEqual(16);
  });

  it("should throw on invalid size", () => {
    expect(() => new FFT(1)).toThrow();
    expect(() => new FFT(0)).toThrow();
    expect(() => new FFT(3)).toThrow();
    expect(() => new FFT(7)).toThrow();
    expect(() => new FFT(9)).toThrow();
    expect(() => new FFT(-1)).toThrow();
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

  it("should throw on same input/output buffers", () => {
    const f = new FFT(8);
    const output = f.createComplexArray();
    expect(() => f.transform(output, output)).toThrow();
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

    data = f.toComplexArray([1, 0]);
    f.transform(out, data);
    expect(out).toStrictEqual([1, 0, 1, 0]);
  });

  it("should transform trivial case", () => {
    const f = new FFT(4);
    const out = f.createComplexArray();
    const data = f.toComplexArray([1, 0.707106, 0, -0.707106]);
    f.transform(out, data);
    const rounded = out.map((x) => Math.round(x * 1000) / 1000);
    expect(rounded.join(":")).toStrictEqual("1:0:1:-1.414:1:0:1:1.414");
  });

  it("should inverse-transform", () => {
    const f = new FFT(4);
    const out = f.createComplexArray();
    const data = f.toComplexArray([1, 0.707106, 0, -0.707106]);
    f.transform(out, data);
    f.inverseTransform(data, out);
    const result = f
      .fromComplexArray(data)
      .map((x) => Math.round(x * 1000) / 1000);
    expect(result).toStrictEqual([1, 0.707, 0, -0.707]);
  });

  it("should transform and inverse-transform 256", () => {
    const input = [...Array(256).keys()];
    const f = new FFT(input.length);
    const out = f.createComplexArray();
    const data = f.toComplexArray(input);
    f.transform(out, data);
    f.inverseTransform(data, out);
    const result = f
      .fromComplexArray(data)
      .map((x) => Math.round(x * 1000) / 1000);
    expect(result.join(":")).toStrictEqual(
      input.map((x) => (Math.round(x * 1000) / 1000).toString()).join(":"),
    );
  });

  it("should transform and inverse-transform 128", () => {
    const input = [...Array(128).keys()];
    const f = new FFT(input.length);
    const out = f.createComplexArray();
    const data = f.toComplexArray(input);
    f.transform(out, data);
    f.inverseTransform(data, out);
    const result = f
      .fromComplexArray(data)
      .map((x) => Math.round(x * 1000) / 1000);
    expect(result.join(":")).toStrictEqual(
      input.map((x) => (Math.round(x * 1000) / 1000).toString()).join(":"),
    );
  });
});

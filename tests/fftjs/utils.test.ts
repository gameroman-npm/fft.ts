import { describe, it, expect } from "bun:test";

import { bitReverseArray } from "../../src/fftjs/utils";

describe("bitReverseArray", () => {
  it("bitReverseArray", () => {
    expect(bitReverseArray(1)).toEqual({
      "0": 0b00,
    });
    expect(bitReverseArray(2)).toEqual({
      "0": 0b00,
      "1": 1,
    });
    expect(bitReverseArray(3)).toEqual({
      "0": 0b00,
      "1": 0b10,
      "2": 0b01,
    });
    expect(bitReverseArray(4)).toEqual({
      "0": 0b00,
      "1": 0b10,
      "2": 0b01,
      "3": 0b11,
    });
    expect(bitReverseArray(5)).toEqual({
      "0": 0b000,
      "1": 0b100,
      "2": 0b010,
      "3": 0b110,
      "4": 0b001,
    });
    expect(bitReverseArray(6)).toEqual({
      "0": 0b000,
      "1": 0b100,
      "2": 0b010,
      "3": 0b110,
      "4": 0b001,
      "5": 0b101,
    });
    expect(bitReverseArray(7)).toEqual({
      "0": 0b000,
      "1": 0b100,
      "2": 0b010,
      "3": 0b110,
      "4": 0b001,
      "5": 0b101,
      "6": 0b011,
    });
    expect(bitReverseArray(8)).toEqual({
      "0": 0b000,
      "1": 0b100,
      "2": 0b010,
      "3": 0b110,
      "4": 0b001,
      "5": 0b101,
      "6": 0b011,
      "7": 0b111,
    });
    expect(bitReverseArray(9)).toEqual({
      "0": 0b0000,
      "1": 0b1000,
      "2": 0b0100,
      "3": 0b1100,
      "4": 0b0010,
      "5": 0b1010,
      "6": 0b0110,
      "7": 0b1110,
      "8": 0b0001,
    });
    expect(bitReverseArray(10)).toEqual({
      "0": 0b0000,
      "1": 0b1000,
      "2": 0b0100,
      "3": 0b1100,
      "4": 0b0010,
      "5": 0b1010,
      "6": 0b0110,
      "7": 0b1110,
      "8": 0b0001,
      "9": 0b1001,
    });
  });
});

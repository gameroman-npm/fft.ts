import { expect } from "bun:test";

import assert from "node:assert";

export function hasOwnProperty(object: unknown, property: string) {
  return object && Object.hasOwnProperty.call(object, property);
}

const EPSILON = 0.0001;

/**
 * Test whether a value is a number
 */
function isNumber(value: unknown): value is number {
  return value instanceof Number || typeof value === "number";
}

/**
 * Test whether two values are approximately equal. Tests whether the difference
 * between the two numbers is smaller than a fraction of their max value.
 * @param {Number | BigNumber | Complex | Fraction} a
 * @param {Number | BigNumber | Complex | Fraction} b
 */
export function approxEqual(a, b, epsilon?: number) {
  if (epsilon === undefined) {
    epsilon = EPSILON;
  }

  if (isNumber(a) && isNumber(b)) {
    if (a === b) {
      // great, we're done :)
    } else if (isNaN(a)) {
      expect(a.toString()).toStrictEqual(b.toString());
    } else if (a === 0) {
      assert.ok(Math.abs(b) < epsilon, a + " ~= " + b);
    } else if (b === 0) {
      assert.ok(Math.abs(a) < epsilon, a + " ~= " + b);
    } else {
      const diff = Math.abs(a - b);
      const max = Math.max(a, b);
      const maxDiff = Math.abs(max * epsilon);
      assert.ok(
        diff <= maxDiff,
        a + " ~= " + b + " (epsilon: " + epsilon + ")"
      );
    }
  } else if (a && a.isBigNumber) {
    return approxEqual(a.toNumber(), b, epsilon);
  } else if (b && b.isBigNumber) {
    return approxEqual(a, b.toNumber(), epsilon);
  } else if ((a && a.isComplex) || (b && b.isComplex)) {
    if (a && a.isComplex && b && b.isComplex) {
      approxEqual(a.re, b.re, epsilon);
      approxEqual(a.im, b.im, epsilon);
    } else if (a && a.isComplex) {
      approxEqual(a.re, b, epsilon);
      approxEqual(a.im, 0, epsilon);
    } else if (b && b.isComplex) {
      approxEqual(a, b.re, epsilon);
      approxEqual(0, b.im, epsilon);
    }
  } else {
    assert.strictEqual(a, b);
  }
}

/**
 * Test whether all values in two objects or arrays are approximately equal.
 * Will deep compare all values of Arrays and Objects element wise.
 */
export function approxDeepEqual(a: unknown, b: unknown, epsilon?: number) {
  let prop, i, len;

  if (Array.isArray(a) && Array.isArray(b)) {
    assert.strictEqual(a.length, b.length, a + " ~= " + b);
    for (i = 0, len = a.length; i < len; i++) {
      approxDeepEqual(a[i], b[i], epsilon);
    }
  } else if (a instanceof Object && b instanceof Object) {
    for (prop in a) {
      if (hasOwnProperty(a, prop)) {
        assert.ok(
          hasOwnProperty(b, prop),
          a[prop] +
            " ~= " +
            b[prop] +
            " (epsilon: " +
            epsilon +
            ", prop: " +
            prop +
            ")"
        );
        approxDeepEqual(a[prop], b[prop], epsilon);
      }
    }

    for (prop in b) {
      if (hasOwnProperty(b, prop)) {
        assert.ok(
          hasOwnProperty(a, prop),
          a[prop] +
            " ~= " +
            b[prop] +
            " (epsilon: " +
            epsilon +
            ", prop: " +
            prop +
            ")"
        );
        approxDeepEqual(a[prop], b[prop], epsilon);
      }
    }
  } else {
    approxEqual(a, b, epsilon);
  }
}

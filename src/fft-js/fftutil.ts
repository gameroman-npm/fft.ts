import * as complex from "./complex";
import type { ComplexNumber } from "./types";

const mapExponent: Record<number, Record<number, ComplexNumber>> = {};

/**
 * By Eulers Formula:
 *
 * `e^(i*x) = cos(x) + i*sin(x)`
 *
 * and in DFT:
 *
 * `x = -2 * PI * (k/N)`
 */
function exponent(k: number, N: number): ComplexNumber {
  const x = -2 * Math.PI * (k / N);

  mapExponent[N] = mapExponent[N] || {};
  mapExponent[N][k] = mapExponent[N][k] || [Math.cos(x), Math.sin(x)]; // [Real, Imaginary]

  return mapExponent[N][k];
}

/**
 * Calculate FFT Magnitude for complex numbers.
 */
function fftMag(fftBins: ComplexNumber[]): number[] {
  const ret = fftBins.map(complex.magnitude);
  return ret.slice(0, ret.length / 2);
}

/**
 * Calculate Frequency Bins
 *
 * Returns an array of the frequencies (in hertz) of
 * each FFT bin provided, assuming the sampleRate is
 * samples taken per second.
 */
function fftFreq(fftBins: ComplexNumber[], sampleRate: number) {
  const stepFreq = sampleRate / fftBins.length;
  const ret = fftBins.slice(0, fftBins.length / 2);

  return ret.map(function (__, ix) {
    return ix * stepFreq;
  });
}

export { exponent, fftMag, fftFreq };

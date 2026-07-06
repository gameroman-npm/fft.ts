type FFTResult = {
  real: number[];
  imag: number[];
};

function reverseBits(val: number, width: number): number {
  let result = 0;
  for (let i = 0; i < width; i++) {
    result = (result << 1) | (val & 1);
    val >>>= 1;
  }
  return result;
}

function isPowerOf2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

function transformRadix2(real: number[], imag: number[]): void {
  const n = real.length;

  if (n <= 1) return;

  let levels = 0;
  for (let i = n; i > 1; i >>= 1) levels++;

  for (let i = 0; i < n; i++) {
    const j = reverseBits(i, levels);
    if (j > i) {
      let temp = real[i]!;
      real[i] = real[j]!;
      real[j] = temp;
      temp = imag[i]!;
      imag[i] = imag[j]!;
      imag[j] = temp;
    }
  }

  const cosTable = Array.from<number>({ length: n / 2 });
  const sinTable = Array.from<number>({ length: n / 2 });
  for (let i = 0; i < n / 2; i++) {
    cosTable[i] = Math.cos((2 * Math.PI * i) / n);
    sinTable[i] = Math.sin((2 * Math.PI * i) / n);
  }

  for (let size = 2; size <= n; size *= 2) {
    const halfsize = size / 2;
    const tablestep = n / size;
    for (let i = 0; i < n; i += size) {
      for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
        const l = j + halfsize;
        const tpre = real[l]! * cosTable[k]! + imag[l]! * sinTable[k]!;
        const tpim = -real[l]! * sinTable[k]! + imag[l]! * cosTable[k]!;
        real[l] = real[j]! - tpre;
        imag[l] = imag[j]! - tpim;
        real[j]! += tpre;
        imag[j]! += tpim;
      }
    }
  }
}

function transformBluestein(real: number[], imag: number[]): void {
  const n = real.length;

  if (n <= 1) return;

  let m = 1;
  while (m < n * 2 + 1) m *= 2;

  const cosTable = Array.from<number>({ length: n });
  const sinTable = Array.from<number>({ length: n });
  for (let i = 0; i < n; i++) {
    const j = (i * i) % (n * 2);
    cosTable[i] = Math.cos((Math.PI * j) / n);
    sinTable[i] = Math.sin((Math.PI * j) / n);
  }

  const areal = Array.from<number>({ length: m }).fill(0);
  const aimag = Array.from<number>({ length: m }).fill(0);
  for (let i = 0; i < n; i++) {
    areal[i] = real[i]! * cosTable[i]! + imag[i]! * sinTable[i]!;
    aimag[i] = -real[i]! * sinTable[i]! + imag[i]! * cosTable[i]!;
  }

  const breal = Array.from<number>({ length: m }).fill(0);
  const bimag = Array.from<number>({ length: m }).fill(0);
  breal[0] = cosTable[0]!;
  bimag[0] = sinTable[0]!;
  for (let i = 1; i < n; i++) {
    breal[i] = cosTable[i]!;
    bimag[i] = sinTable[i]!;
    breal[m - i] = cosTable[i]!;
    bimag[m - i] = sinTable[i]!;
  }

  const creal = Array.from<number>({ length: m });
  const cimag = Array.from<number>({ length: m });
  convolveComplex(areal, aimag, breal, bimag, creal, cimag, m);

  for (let i = 0; i < n; i++) {
    real[i] = creal[i]! * cosTable[i]! + cimag[i]! * sinTable[i]!;
    imag[i] = -creal[i]! * sinTable[i]! + cimag[i]! * cosTable[i]!;
  }
}

function convolveComplex(
  xreal: number[],
  ximag: number[],
  yreal: number[],
  yimag: number[],
  outreal: number[],
  outimag: number[],
  n: number,
): void {
  const xr = xreal.slice(0, n);
  const xi = ximag.slice(0, n);
  const yr = yreal.slice(0, n);
  const yi = yimag.slice(0, n);

  transformRadix2(xr, xi);
  transformRadix2(yr, yi);

  for (let i = 0; i < n; i++) {
    const temp = xr[i]! * yr[i]! - xi[i]! * yi[i]!;
    xi[i] = xi[i]! * yr[i]! + xr[i]! * yi[i]!;
    xr[i] = temp;
  }

  for (let i = 0; i < n; i++) xi[i] = -xi[i]!;
  transformRadix2(xr, xi);
  for (let i = 0; i < n; i++) {
    outreal[i] = xr[i]! / n;
    outimag[i] = -xi[i]! / n;
  }
}

function _fft(real: number[], imag: number[]): void {
  const n = real.length;
  if (n === 0) return;
  if (isPowerOf2(n)) {
    transformRadix2(real, imag);
  } else {
    transformBluestein(real, imag);
  }
}

function fft(real: number[], imag: number[]): FFTResult {
  const realCopy = real.slice();
  const imagCopy = imag.slice();
  _fft(realCopy, imagCopy);
  return { real: realCopy, imag: imagCopy };
}

function ifft(real: number[], imag: number[]): FFTResult {
  const n = real.length;
  const realCopy = real.slice();
  const imagCopy = imag.slice();

  for (let i = 0; i < n; i++) imagCopy[i] = -imagCopy[i]!;
  _fft(realCopy, imagCopy);
  for (let i = 0; i < n; i++) {
    realCopy[i]! /= n;
    imagCopy[i] = -imagCopy[i]! / n;
  }

  return { real: realCopy, imag: imagCopy };
}

export { fft, ifft };

export type { FFTResult };

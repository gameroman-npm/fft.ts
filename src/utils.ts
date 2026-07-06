type ComplexObj = { real: number; imag: number };

function fftfreq(n: number, frequency: number): number[] {
  const freqs = Array.from<number>({ length: n });
  const factor = 1.0 / (n * (1 / frequency));
  for (let i = 0; i < n; ++i) {
    freqs[i] = (i < n / 2 ? i : i - n) * factor;
  }
  return freqs;
}

function fftshift<T extends number | [number, number]>(arr: T[]): T[] {
  const n = arr.length;
  const half = Math.ceil(n / 2);
  return [...arr.slice(half), ...arr.slice(0, half)];
}

export { fftfreq, fftshift };
export type { ComplexObj };

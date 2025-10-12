import dft from "./dft";
import type { ComplexNumber } from "./types";

function idft(signal): ComplexNumber[] {
  // Interchange real and imaginary parts
  const csignal: ComplexNumber[] = [];
  for (let i = 0; i < signal.length; i++) {
    csignal[i] = [signal[i][1], signal[i][0]];
  }

  // Apply dft
  const ps = dft(csignal);

  // Interchange real and imaginary parts and normalize
  const res: ComplexNumber[] = [];
  for (let j = 0; j < ps.length; j++) {
    res[j] = [ps[j]![1] / ps.length, ps[j]![0] / ps.length];
  }
  return res;
}

export default idft;

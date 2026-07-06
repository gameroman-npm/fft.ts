# fft.ts

Fast Fourier Transform in TypeScript. Supports any input size (power-of-2 via Cooley-Tukey radix-2, arbitrary via Bluestein's algorithm).

```ts
import { fft, ifft, fftfreq, fftshift } from "fft.ts";

const real = [1, 0, 1, 0];
const imag = [0, 0, 0, 0];

const result = fft(real, imag);
// { real: [2, 0, 2, 0], imag: [0, 0, 0, 0] }

const back = ifft(result.real, result.imag);
// { real: [1, 0, 1, 0], imag: [0, 0, 0, 0] }
```

## Fast (radix-4) class

Power-of-2 only, precomputed tables, optimized for repeated transforms.

```ts
import { FFT } from "fft.ts/fast";

const f = new FFT(1024);
const out = f.createComplexArray();
const data = f.toComplexArray(input);
f.transform(out, data);
f.inverseTransform(data, out);
```

## Utilities

```ts
import { fftfreq, fftshift } from "fft.ts/utils";

const freqs = fftfreq(1024, 48000); // frequency bins
const shifted = fftshift(phasors); // shift zero to center
```

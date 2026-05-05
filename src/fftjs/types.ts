type ComplexNumber = { real: number; imag: number };

type ComplexSignal = { real: number[]; imag: number[] };

type RealSignal = number[] & { real?: undefined };

type Signal = ComplexSignal | RealSignal;

export type { ComplexNumber, ComplexSignal, Signal };

type RealPart = number & {};
type ComplexPart = number & {};

type ComplexNumber = [RealPart, ComplexPart];

type Vector = (number | ComplexNumber)[];

export type { ComplexNumber, Vector };

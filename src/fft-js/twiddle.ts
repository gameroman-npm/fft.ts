/** Number of bits in an integer */
const INT_BITS = 32;
const INT_MIN = -1 << (INT_BITS - 1);

export { INT_BITS, INT_MIN };

/** Counts number of trailing zeros */
function countTrailingZeros(v: number): number {
  let c = 32;
  v &= -v;
  if (v) c--;
  if (v & 0x0000ffff) c -= 16;
  if (v & 0x00ff00ff) c -= 8;
  if (v & 0x0f0f0f0f) c -= 4;
  if (v & 0x33333333) c -= 2;
  if (v & 0x55555555) c -= 1;
  return c;
}

const REVERSE_TABLE = Array.from<number>({ length: 256 });

(function (tab) {
  for (let i = 0; i < 256; ++i) {
    let v = i;
    let r = i;
    let s = 7;
    for (v >>>= 1; v; v >>>= 1) {
      r <<= 1;
      r |= v & 1;
      --s;
    }
    tab[i] = (r << s) & 0xff;
  }
})(REVERSE_TABLE);

/** Reverse bits in a 32 bit word */
function reverse(v: number): number {
  return (
    (REVERSE_TABLE[v & 0xff] << 24) |
    (REVERSE_TABLE[(v >>> 8) & 0xff] << 16) |
    (REVERSE_TABLE[(v >>> 16) & 0xff] << 8) |
    REVERSE_TABLE[(v >>> 24) & 0xff]
  );
}

export { countTrailingZeros, reverse };

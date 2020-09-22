interface Capacity {
  capacity: number
  residual: number
}

/**
 * QR コードの総コード語数情報。
 */
export const capacities: { [type: number]: Capacity } = {
  1: { capacity: 26, residual: 0 },
  2: { capacity: 44, residual: 7 },
  3: { capacity: 70, residual: 7 },
  4: { capacity: 100, residual: 7 },
  5: { capacity: 134, residual: 7 },
  6: { capacity: 172, residual: 7 },
  7: { capacity: 196, residual: 0 },
  8: { capacity: 242, residual: 0 },
  9: { capacity: 292, residual: 0 },
  10: { capacity: 346, residual: 0 },
  11: { capacity: 404, residual: 0 },
  12: { capacity: 466, residual: 0 },
  13: { capacity: 532, residual: 0 },
  14: { capacity: 581, residual: 3 },
  15: { capacity: 655, residual: 3 },
  16: { capacity: 733, residual: 3 },
  17: { capacity: 815, residual: 3 },
  18: { capacity: 901, residual: 3 },
  19: { capacity: 991, residual: 3 },
  20: { capacity: 1085, residual: 3 },
  21: { capacity: 1156, residual: 4 },
  22: { capacity: 1258, residual: 4 },
  23: { capacity: 1364, residual: 4 },
  24: { capacity: 1474, residual: 4 },
  25: { capacity: 1588, residual: 4 },
  26: { capacity: 1706, residual: 4 },
  27: { capacity: 1828, residual: 4 },
  28: { capacity: 1921, residual: 3 },
  29: { capacity: 2051, residual: 3 },
  30: { capacity: 2185, residual: 3 },
  31: { capacity: 2323, residual: 3 },
  32: { capacity: 2465, residual: 3 },
  33: { capacity: 2611, residual: 3 },
  34: { capacity: 2761, residual: 3 },
  35: { capacity: 2876, residual: 0 },
  36: { capacity: 3034, residual: 0 },
  37: { capacity: 3196, residual: 0 },
  38: { capacity: 3362, residual: 0 },
  39: { capacity: 3532, residual: 0 },
  40: { capacity: 3706, residual: 0 },
}

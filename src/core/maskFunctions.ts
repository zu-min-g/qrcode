/**
 * マスク関数
 */
const maskFunctions: {
  [maskId: number]: (x: number, y: number) => boolean
} = {
  0: (x: number, y: number) => (x + y) % 2 === 0,
  1: (x: number, y: number) => y % 2 === 0,
  2: (x: number) => x % 3 === 0,
  3: (x: number, y: number) => (x + y) % 3 === 0,
  4: (x: number, y: number) =>
    (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  5: (x: number, y: number) => ((x * y) % 2) + ((x * y) % 3) === 0,
  6: (x: number, y: number) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  7: (x: number, y: number) => (((x * y) % 3) + ((x + y) % 2)) % 2 === 0,
}

export default maskFunctions

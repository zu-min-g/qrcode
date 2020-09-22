import { RsBlock } from "../data"

/**
 * RSブロックに分割します。
 * @param bit
 * @param rb
 */
export default function createRsBlocks(
  bit: Uint8ClampedArray,
  rb: RsBlock[]
): { [n: number]: Uint8ClampedArray } {
  const block: { [n: number]: Uint8ClampedArray } = []
  let rs_count = 0
  let pos = 0
  for (let i = 0, ln = rb.length; i < ln; i++) {
    for (let j = 0; j < rb[i][0]; j++) {
      block[rs_count] = new Uint8ClampedArray(rb[i][2])
      for (let k = 0; k < rb[i][2]; k++) {
        block[rs_count][k] = bit[pos]
        pos++
      }
      rs_count++
    }
  }
  return block
}

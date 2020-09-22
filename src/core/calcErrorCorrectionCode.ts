import { alpha, alphaFlip, expressions, rsBlock, RsBlock } from "../data"
import * as Str from "../core/Str"
import { QRData } from "./QRStruct"

/**
 * 誤り訂正コードを算出します。
 * @param block
 */
export function calcErrorCorrectionCodeAll(
  block: {
    [n: number]: Uint8ClampedArray
  },
  struct: QRData
): { [n: number]: Uint8ClampedArray } {
  let rs_count = 0
  const blockECC: { [n: number]: Uint8ClampedArray } = []
  const rb = rsBlock[struct.level][struct.type - 1]

  rb.forEach((value, key) => {
    for (let i = 0; i < rb[key][0]; i++) {
      const eccBlock = calcErrorCorrectionCode(block[rs_count], rb[key])
      blockECC[rs_count] = eccBlock
      rs_count++
    }
  })

  return blockECC
}

/**
 * 誤り訂正コードを算出します。
 * @param rsBlock
 * @param rb
 */
export function calcErrorCorrectionCode(
  rsBlock: Uint8ClampedArray,
  rb: RsBlock
): Uint8ClampedArray {
  /** 総コード語数 */
  const totalLen = rb[1]
  /** データコード語数 */
  const dataLen = rb[2]
  /** エラー訂正コード語数 */
  const eccLen = totalLen - dataLen

  /** 生成多項式の次数 */
  const n = eccLen + 1
  /** 生成多項式 */
  const exp = expressions[eccLen]

  /** データ + エラー訂正コードを 8bit ごとに配列として保持 */
  const eps = new Uint8ClampedArray(totalLen)
  for (let i = 0; i < dataLen; i++) {
    eps[i] = rsBlock[i]
  }

  // バグ検知用
  if (rsBlock.length !== dataLen) {
    throw new Error("データコード語が不足しています")
  }

  for (let j = 0; j < dataLen; j++) {
    const a = alphaFlip[eps[j]]
    for (let k = j; k < j + n; k++) {
      // 乗算。α^{a} × α^{exp[k - j]} のため、α の冪部分を足している。但し a が -1 の場合は 0。
      const g = a === -1 ? 0 : alpha[(a + exp[k - j]) % 255]

      // 加算（XOR）
      eps[k] = g ^ eps[k]
    }
  }

  // 2進表記の文字列に戻す
  const ret = eps.slice(dataLen)

  // データコードを除き、エラー訂正コード部分のみ返却
  return ret
}

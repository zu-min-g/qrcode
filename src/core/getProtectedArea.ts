import { alignmentPoints } from "../data"
import { getSize } from "./QR"
import { QRStruct } from "./QRStruct"

let cache: boolean[][][]

export function clearCache(): void {
  cache = []
}

clearCache()

/**
 * データ部以外の座標を取得します。
 */
export default function getProtectedArea(struct: QRStruct): boolean[][] {
  if (typeof cache[struct.type] !== "undefined") {
    return cache[struct.type]
  }

  const ret: boolean[][] = []
  const size = getSize(struct.type)

  for (let x = 0; x < size; x++) {
    ret[x] = []
    for (let y = 0; y < size; y++) {
      if (x === 6 || y === 6) {
        // タイミングパターン
        ret[x][y] = true
      } else if (
        (x <= 8 && y <= 8) ||
        (x <= 8 && y >= size - 8) ||
        (y <= 8 && x >= size - 8)
      ) {
        // 位置検出パターン＆形式情報
        ret[x][y] = true
      } else if (
        struct.type >= 7 &&
        ((x <= 5 && y >= size - 11) || (y <= 5 && x >= size - 11))
      ) {
        // 型番情報
        ret[x][y] = true
      } else {
        ret[x][y] = false
      }
    }
  }

  // 位置合わせパターン
  if (struct.type > 1) {
    const l = alignmentPoints[struct.type]
    for (let i = 0; i < l.length; i++) {
      for (let j = 0; j < l.length; j++) {
        // 位置検出パターンと重なる部分は、位置合わせパターンを描画しないので除外
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === l.length - 1) ||
          (i === l.length - 1 && j === 0)
        )
          continue

        for (let x = l[i] - 2; x <= l[i] + 2; x++) {
          for (let y = l[j] - 2; y <= l[j] + 2; y++) {
            ret[x][y] = true
          }
        }
      }
    }
  }

  cache[struct.type] = ret
  return ret
}

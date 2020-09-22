/**
 * 配列をコピーします。
 * オブジェクトには対応していません。
 * @param src
 */
export function copy<T>(src: T[]): T[] {
  const dest: T[] = []
  src.forEach((v, index) => {
    let val = src[index]
    if (Array.isArray(val)) {
      val = (copy(val) as unknown) as T
    }
    dest[index] = val
  })
  return dest
}

/**
 * null または undefined の要素を除去します。
 * 引数の配列は直接操作します。
 * @param arr
 */
export function deleteEmpty<T>(arr: T[]): T[] {
  let length = 0
  for (let x = 0; x < arr.length; x++) {
    if (typeof arr[x] === "undefined" || arr[x] === null) {
      delete arr[x]
      continue
    }
    length = x + 1
    const list = arr[x]
    if (Array.isArray(list)) {
      const newArr = deleteEmpty(list)
      if (newArr.length !== 0) {
        arr[x] = (newArr as unknown) as T
      } else {
        delete arr[x]
      }
    }
  }
  return arr.slice(0, length)
}

/**
 * 行列変換を行います。
 * 配列は新規作成します。
 * @param src
 * @param srcX 最初の次元の長さ
 * @param srcY 2番目の次元の長さ
 */
export function transform<T>(src: T[][], srcX: number, srcY: number): T[][] {
  const dest: T[][] = []

  for (let x = 0; x < srcX; x++) {
    if (!(x in src)) {
      continue
    }
    for (let y = 0; y < srcY; y++) {
      if (!(y in src[x])) {
        continue
      }
      if (typeof dest[y] === "undefined") {
        dest[y] = []
      }
      dest[y][x] = src[x][y]
    }
  }
  return dest
}

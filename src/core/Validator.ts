/**
 * 型を検査します。
 * @param val 対象の値
 * @param types 許容する型
 * @param optional 追加検査
 */
export function isValidType(
  val: unknown,
  types: string[],
  optional?: (val: unknown) => boolean
): boolean {
  if (types.indexOf(typeof val) === -1) {
    return false
  }
  if (typeof val === "undefined" || typeof optional === "undefined") {
    return true
  }
  if (!optional(val)) {
    return false
  }
  return true
}

/**
 * 指定した値が undefined の場合、デフォルト値を返却します。
 * @param val
 * @param defaultValue
 */
export function defaultValue<T>(val: T | undefined, defaultValue: T): T {
  return typeof val === "undefined" ? defaultValue : val
}

/**
 * 範囲外の数値が指定された場合、最小値または最大値に置き換えます。
 * @param val
 * @param min
 * @param max
 */
export function restrictRange(val: number, min: number, max: number): number {
  if (val < min) return min
  if (val > max) return max
  return val
}

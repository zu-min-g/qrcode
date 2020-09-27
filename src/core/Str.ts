import { EightBitEncoder } from "../encoder"

/**
 * 指定文字数になるまで、指定した文字で埋めます。
 * @param str 入力
 * @param len 長さ
 * @param pad 埋め文字
 * @param type left(before), right(after), both
 */
export function pad(
  str: string,
  len: number,
  pad = "0",
  type = "left"
): string {
  if (str.length >= len) return str
  if (type === "both") {
    while (str.length < len) str = pad + str + pad
    str = str.substr(Math.floor((str.length - len) / 2), len)
  } else if (type === "before" || type === "left")
    while (str.length < len) str = pad + str
  else while (str.length < len) str += pad
  return str.substr(0, len)
}

/**
 * 数値（10進数）を、固定長の2進数表記の文字列に変換します
 * @param dec
 * @param len 0埋め
 */
export function toBin(dec: number, len: number): string {
  return pad(dec.toString(2), len, "0", "left")
}

/**
 * 指定文字列の先頭から指定した長さの文字列を返却します。
 * @param str
 * @param limit 最大長（バイト）
 * @param encoder
 */
export function split8Bit(
  str: string,
  limit: number,
  encoder: EightBitEncoder
): { bytes: number; value: string } {
  const chars = [...str]
  let bytes = 0
  let value = ""
  while (chars.length > value.length) {
    const char = chars[value.length]
    const cl = encoder.len(char)
    if (bytes + cl > limit) break
    bytes += cl
    value += char
  }

  return {
    bytes,
    value,
  }
}

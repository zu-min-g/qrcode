import {
  Encoder,
  isEncoder,
  EncoderOptions,
  isEncoderOptions,
} from "../encoder/"
import { isValidType } from "./Validator"

/**
 * QR コード生成時の設定
 */
export interface QROptions {
  /** 型番 */
  type?: number

  /** 誤り訂正レベル */
  level?: EccLevel

  /** 分割数 */
  division?: number

  /** 文字列をQRコード形式に符号化するエンコーダー */
  encoder?: EncoderOptions | Encoder

  /** デバッグログを有効にするか */
  debug?: boolean

  /** マスクを指定する場合 */
  mask?: Mask
}

export function isQROptions(obj: unknown): obj is QROptions {
  if (typeof obj !== "object") return false
  const options = obj as QROptions
  if (!isValidType(options.type, ["undefined", "number"])) return false
  if (!isValidType(options.level, ["undefined", "number"], isEccLevel))
    return false
  if (!isValidType(options.division, ["undefined", "number"])) return false
  if (
    !isValidType(
      options.encoder,
      ["undefined", "object"],
      (v) => isEncoder(v) || isEncoderOptions(v)
    )
  )
    return false
  if (!isValidType(options.debug, ["undefined", "boolean"])) return false
  if (!isValidType(options.mask, ["undefined", "number"])) return false
  return true
}

export type Mask = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

/**
 * 誤り訂正レベル。
 *
 * L, M, Q, H の順で、 H 側が誤り訂正能力が高いがデータ量も多くなる。
 */
export enum EccLevel {
  /** L */
  L = 0b01,
  /** M */
  M = 0b00,
  /** Q */
  Q = 0b11,
  /** H */
  H = 0b10,
}

export function isEccLevel(val: unknown): val is EccLevel {
  if (typeof val !== "number") return false
  if (!(val in EccLevel)) return false
  return true
}

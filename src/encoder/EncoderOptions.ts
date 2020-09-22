import { BasicEncoder, Uni2Sjis, Utf8 } from "."
import { Encoder, isEncoder } from "./Encoder"
import { defaultValue, isValidType } from "../core/Validator"

/**
 * エンコーダーの設定。
 */
export interface EncoderOptions {
  /** 文字コード。デフォルトは UTF-8。 */
  charset?: string

  /** ECI ヘッダを出力するか。デフォルトは false。 */
  useEci?: boolean
}

export function isEncoderOptions(obj: unknown): obj is EncoderOptions {
  if (typeof obj !== "object") return false
  const options = obj as EncoderOptions
  if (!isValidType(options.charset, ["undefined", "string"])) return false
  if (!isValidType(options.useEci, ["undefined", "boolean"])) return false
  return true
}

export function createEncoder(option: EncoderOptions | Encoder): Encoder {
  if (isEncoder(option)) {
    return option
  }

  const charset = defaultValue(option.charset, "utf8")
    .toLowerCase()
    .replace(/[-_]/, "")
  const useEci = defaultValue(option.useEci, false)

  switch (charset) {
    case "utf8":
      return new BasicEncoder(new Utf8(), useEci)
    case "shiftjis":
      return new BasicEncoder(new Uni2Sjis(), useEci)
  }

  throw new Error("サポートしていない文字コードです")
}

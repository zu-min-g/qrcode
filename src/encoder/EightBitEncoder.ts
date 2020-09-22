import { ByteArrayBuilder } from "../core/ByteArrayBuilder"

/**
 * 8ビットバイトモード時のエンコーダー。
 */
export interface EightBitEncoder {
  /** 文字列のバイト数を返却します */
  len(str: string): number
  /** 文字列をバイナリに変換し ba に追加します */
  toBinary(ba: ByteArrayBuilder, str: string): void
  /** ECI モード指示子を返却します */
  getEciSpecifier(): string
}

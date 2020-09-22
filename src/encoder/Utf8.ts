import { EightBitEncoder } from "./EightBitEncoder"
import * as Str from "../core/Str"
import { ByteArrayBuilder } from "../"

export class Utf8 implements EightBitEncoder {
  protected encoder = new TextEncoder()
  len(str: string): number {
    const arr = this.encoder.encode(str)
    return arr.length
  }

  toBinary(ba: ByteArrayBuilder, str: string): void {
    const arr = this.encoder.encode(str)
    for (let i = 0, len = arr.length; i < len; i++) {
      ba.addByte(arr[i])
    }
  }

  getEciSpecifier(): string {
    // 26: UTF-8
    return Str.toBin(26, 8)
  }
}

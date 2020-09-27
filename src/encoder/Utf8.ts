import { EightBitEncoder } from "./EightBitEncoder"
import * as Str from "../core/Str"
import { ByteArrayBuilder } from "../"

export class Utf8 implements EightBitEncoder {
  protected encoder: TextEncoderWrapper | TextEncoderPolyfill
  constructor(useNativeCode = true) {
    if (useNativeCode && typeof TextEncoder !== "undefined") {
      this.encoder = new TextEncoderWrapper()
    } else {
      this.encoder = new TextEncoderPolyfill()
    }
  }
  len(str: string): number {
    return this.encoder.len(str)
  }

  toBinary(ba: ByteArrayBuilder, str: string): void {
    return this.encoder.toBinary(ba, str)
  }

  getEciSpecifier(): string {
    // 26: UTF-8
    return Str.toBin(26, 8)
  }
}

export class TextEncoderPolyfill {
  len(str: string): number {
    let len = 0
    for (let i = 0; i < str.length; i++) {
      let code: number
      const first = str.charCodeAt(i)
      if (first >= 0xd800 && first <= 0xdbff) {
        i++
        const second = str.charCodeAt(i)
        code = (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000
      } else {
        code = first
      }
      len += this.utf8Len(code)
    }
    return len
  }

  utf8Len(code: number): number {
    if (code >= 0x0000 && code <= 0x007f) {
      return 1
    } else if (code >= 0x0080 && code <= 0x07ff) {
      return 2
    } else if (code >= 0x0800 && code <= 0xffff) {
      return 3
    } else if (code >= 0x10000 && code <= 0x10ffff) {
      return 4
    } else {
      throw new Error("サポートしていない文字が含まれます。")
    }
  }

  toBinary(ba: ByteArrayBuilder, str: string): void {
    for (let i = 0; i < str.length; i++) {
      let code: number
      const first = str.charCodeAt(i)
      if (first >= 0xd800 && first <= 0xdbff) {
        i++
        const second = str.charCodeAt(i)
        code = (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000
      } else {
        code = first
      }
      this.uni2utf8(ba, code)
    }
  }

  uni2utf8(ba: ByteArrayBuilder, code: number): void {
    if (code >= 0x0000 && code <= 0x007f) {
      ba.addBinary(code, 8)
    } else if (code >= 0x0080 && code <= 0x07ff) {
      ba.addBinary(
        0b1100000010000000 | (code & 0b111111) | ((code & 0b11111000000) << 2),
        16
      )
    } else if (code >= 0x0800 && code <= 0xffff) {
      ba.addBinary(
        0b111000001000000010000000 |
          (code & 0b111111) |
          ((code & 0b111111000000) << 2) |
          ((code & 0b1111000000000000) << 4),
        24
      )
    } else if (code >= 0x10000 && code <= 0x10ffff) {
      ba.addBinary(
        0b11110000100000001000000010000000 |
          (code & 0b111111) |
          ((code & 0b111111000000) << 2) |
          ((code & 0b111111000000000000) << 4) |
          ((code & 0b111000000000000000000) << 6),
        32
      )
    } else {
      throw new Error("サポートしていない文字が含まれます。")
    }
  }
}

export class TextEncoderWrapper {
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
}

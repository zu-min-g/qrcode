import { Binary, Byte, Bit } from "./QR"
import * as Str from "../core/Str"

export class ByteArrayBuilder {
  protected _arr: Byte[] = []
  protected _free = 0
  protected _position = -1

  get bitLength(): number {
    return this._position * 8 + (8 - this._free)
  }

  get length(): number {
    return this._position + 1
  }

  addByte(x: Byte): void {
    this.addBinary(x, 8)
  }

  addBinary(x: Binary, len: number): void {
    for (let pos = len - 1; pos >= 0; pos--) {
      this.addBit(((x >> pos) & 1) as Bit)
    }
  }

  addBit(x: Bit): void {
    if (this._free === 0) {
      this._free = 8
      this._position++
      this._arr[this._position] = 0
    }
    this._arr[this._position] = (this._arr[this._position] << 1) | x
    this._free--
  }

  addBinStr(str: string): void {
    const len = str.length
    for (let pos = 0; pos < len; pos++) {
      this.addBit(str.substr(pos, 1) === "1" ? 1 : 0)
    }
  }

  toByteArray(): Uint8ClampedArray {
    const ret = new Uint8ClampedArray(this._position + 1)
    this._arr.forEach((val, index) => {
      ret[index] = val
    })
    if (this._free !== 0) {
      ret[this._position] = ret[this._position] << this._free
    }
    return ret
  }

  toBinStr(): string {
    let str = ""
    for (let index = 0; index < this._position; index++) {
      str += Str.toBin(this._arr[index], 8)
    }
    if (this._position >= 0) {
      str += Str.toBin(this._arr[this._position], 8 - this._free)
    }
    return str
  }

  setBinary(binary: number, len: number, position: number): void {
    for (let index = 0; index < len; index++) {
      const bitPosition = 7 - (position % 8)
      const bit = (binary >> (len - index - 1)) & 1
      const bytePosition = (position - (position % 8)) / 8
      this.setBit(bit as Bit, bytePosition, bitPosition)
      position++
    }
  }

  setBit(bit: Bit, bytePosition: number, bitPosition: number): void {
    const mask = 255 & ~(1 << bitPosition)
    this._arr[bytePosition] =
      (this._arr[bytePosition] & mask) | (bit << bitPosition)
  }

  pad(spacer: Binary, spacerLen: number, len: number): void {
    const rem = len - this.bitLength
    for (let i = 0; i < rem; i++) {
      const bit = (spacer >> (spacerLen - (i % spacerLen) - 1)) & 1
      this.addBit(bit as Bit)
    }
  }
}

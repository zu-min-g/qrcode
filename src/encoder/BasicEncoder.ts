import { charset, maxDataLen, strLenSpecLength } from "../data"
import * as QR from "../core/QR"
import { EightBitEncoder } from "."
import { ModeSpecifier } from "../core/ModeSpecifier"
import { Encoder, EncodeResult } from "./Encoder"
import { QRStruct } from "../core/QRStruct"
import { ByteArrayBuilder } from "../core/ByteArrayBuilder"
import { EccLevel } from "../core/QROptions"

const TRIO = 3
const PAIR = 2
const SINGLE = 1

const LEN_NUMBER_TRIO = 10
const LEN_NUMBER_PAIR = 7
const LEN_NUMBER_SINGLE = 4

const LEN_ALPHABET_PAIR = 11
const LEN_ALPHABET_SINGLE = 6

const LEN_EIGHT_BIT = 8

/** モード指示子の長さ */
const LEN_MODE_SPECIFIER = 4

/** ヘッダブロックの長さ（モード指示子＋シンボル列指示子＋パリティデータ） */
const LEN_HEADER_BLOCK = LEN_MODE_SPECIFIER + 16

/** 数字から英数字モードに変更する条件 */
const ALPHABET_PATTERN = /^[A-Z $%*+\-./:]/

/** 数字または英数字から 8 ビットに変更する条件 */
const EIGHT_BIT_PATTERN = /^[^A-Z0-9 $%*+\-./:]/

type SupportedMode =
  | ModeSpecifier.Number
  | ModeSpecifier.Alphabet
  | ModeSpecifier.EightBit

/**
 * 指定したモードの最小ビット数を返します。
 * @param cType
 */
export const minLength = (cType: SupportedMode): number => {
  switch (cType) {
    case ModeSpecifier.Number:
      return LEN_NUMBER_SINGLE
    case ModeSpecifier.Alphabet:
      return LEN_ALPHABET_SINGLE
    case ModeSpecifier.EightBit:
      return LEN_EIGHT_BIT
  }
}

/**
 * 指定した長さのうち、数字の場合格納できる文字数を返却します。
 * @param l ビット数
 */
export function freeLengthInNumeric(l: number): number {
  return (
    Math.floor(l / LEN_NUMBER_TRIO) * TRIO +
    (l % LEN_NUMBER_TRIO >= LEN_NUMBER_PAIR
      ? PAIR
      : l % LEN_NUMBER_TRIO >= LEN_NUMBER_SINGLE
      ? SINGLE
      : 0)
  )
}

/**
 * 指定した長さのうち、数字の場合格納できる文字数を返却します。
 * @param l ビット数
 */
export function freeLengthInAlphabet(l: number): number {
  return (
    Math.floor(l / LEN_ALPHABET_PAIR) * PAIR +
    (l % LEN_ALPHABET_PAIR >= LEN_ALPHABET_SINGLE ? SINGLE : 0)
  )
}

/**
 * 数字モードでエンコードした場合のビット長を返します。
 * @param src
 */
export function countNumber(src: string): number {
  const l = src.length
  return (
    Math.floor(l / 3) * LEN_NUMBER_TRIO +
    (l % 3 == 2 ? LEN_NUMBER_PAIR : l % 3 == 1 ? LEN_NUMBER_SINGLE : 0)
  )
}

/**
 * 数字モードでエンコードします。
 * @param ba 出力先
 * @param src エンコード対象
 */
export function encodeNumber(ba: ByteArrayBuilder, src: string): void {
  const len = src.length / 3
  for (let i = 0; i < len; i++) {
    if (3 * (i + 1) <= src.length) {
      const trio = parseInt(src[3 * i] + src[3 * i + 1] + src[3 * i + 2])
      ba.addBinary(trio, LEN_NUMBER_TRIO)
    } else if (3 * (i + 1) - 1 <= src.length) {
      const pair = parseInt(src[3 * i] + src[3 * i + 1])
      ba.addBinary(pair, LEN_NUMBER_PAIR)
    } else {
      const single = parseInt(src[3 * i])
      ba.addBinary(single, LEN_NUMBER_SINGLE)
    }
  }
}

/**
 * 英数字モードでエンコードした場合のビット長を返します。
 * @param src
 */
export function countAlphabet(src: string): number {
  const l = src.length
  return (
    Math.floor(l / 2) * LEN_ALPHABET_PAIR +
    (l % 2 == 1 ? LEN_ALPHABET_SINGLE : 0)
  )
}

/**
 * 英数字モードでエンコードします。
 * @param ba 出力先
 * @param src エンコード対象
 */
export function encodeAlphabet(ba: ByteArrayBuilder, src: string): void {
  src = src.toUpperCase()
  const len = src.length / 2
  for (let i = 0; i < len; i++) {
    if (2 * (i + 1) <= src.length) {
      const pair = charset[src[2 * i]] * 45 + (charset[src[2 * i + 1]] - 0)
      ba.addBinary(pair, LEN_ALPHABET_PAIR)
    } else {
      const single = charset[src[2 * i]] - 0
      ba.addBinary(single, LEN_ALPHABET_SINGLE)
    }
  }
}

/**
 * 文字列の開始時点の最適なエンコーディングを検知します。
 */
export const detectFirstCharset = (
  data: string,
  type: number
): SupportedMode => {
  if (data.match(EIGHT_BIT_PATTERN) !== null) {
    return ModeSpecifier.EightBit
  } else if (data.match(ALPHABET_PATTERN) !== null) {
    if (
      data.match(
        new RegExp(
          "^[A-Z0-9 $%*+\\-./:]{1," +
            (QR.s(type, 6, 7, 8) - 1) +
            "}[^A-Z0-9 $%*+\\-./:]"
        )
      ) !== null
    ) {
      return ModeSpecifier.EightBit
    }
    return ModeSpecifier.Alphabet
  } else {
    if (
      data.match(
        new RegExp(
          "^[0-9]{1," + (QR.s(type, 4, 4, 5) - 1) + "}[^A-Z0-9 $%*+\\-./:]"
        )
      ) !== null
    ) {
      return ModeSpecifier.EightBit
    } else if (
      data.match(
        new RegExp(
          "^[0-9]{1," + (QR.s(type, 7, 8, 9) - 1) + "}[A-Z $%*+\\-./:]"
        )
      ) !== null
    ) {
      return ModeSpecifier.Alphabet
    }
  }

  return ModeSpecifier.Number
}

/**
 * 文字列を符号化します。
 * @see Encoder
 */
export class BasicEncoder implements Encoder {
  protected firstCharset: SupportedMode = ModeSpecifier.Number
  protected level = 0
  protected data = ""

  /**
   * @param encoder 8ビットバイトモード時のエンコーダー
   * @param useEci ECI ヘッダーを使用するか
   */
  constructor(protected encoder: EightBitEncoder, protected useEci = true) {}

  /**
   * @inheritdoc
   */
  public initialize(level: EccLevel, data: string, firstType: number): void {
    this.level = level
    this.data = data
    this.firstCharset = detectFirstCharset(data, firstType)
  }

  /**
   * @inheritdoc
   */
  public try(struct: QRStruct): EncodeResult {
    const encoder = new TryBasicEncode(
      struct,
      this.level,
      this.data,
      this.firstCharset,
      this.encoder,
      this.useEci
    )
    return encoder.try()
  }

  /**
   * @inheritdoc
   */
  predictDataSize(): number {
    /** 推測データ長 */
    let dLen = 0
    /** 推測ヘッダ長 */
    let hLen = 0
    let matches
    if ((matches = this.data.match(/[0-9]+/g)) !== null) {
      dLen += LEN_MODE_SPECIFIER + countNumber(matches.join(""))
      hLen = strLenSpecLength[ModeSpecifier.Number][0] // 上書きする
    }
    if ((matches = this.data.match(/[A-Z $%*+\-./:]+/g)) !== null) {
      dLen += LEN_MODE_SPECIFIER + countAlphabet(matches.join(""))
      hLen = strLenSpecLength[ModeSpecifier.Alphabet][0] // 上書きする
    }
    if ((matches = this.data.match(/[^A-Z0-9 $%*+\-./:]+/g)) !== null) {
      const l = matches.join("").length
      dLen += LEN_MODE_SPECIFIER + l * LEN_EIGHT_BIT
      hLen = strLenSpecLength[ModeSpecifier.EightBit][0] // 上書きする
    }
    dLen += hLen
    return dLen
  }

  /**
   * @inheritdoc
   */
  public getParityData(): number {
    const ba = new ByteArrayBuilder()
    this.encoder.toBinary(ba, this.data)
    const arr = ba.toByteArray()
    let parity = 0
    arr.forEach((val) => {
      parity = parity ^ val
    })
    return parity
  }
}

export class TryBasicEncode {
  /** 8 ビットから英数字に変更した方が効率の良い文字数 */
  protected thresholdEightBitToAlpha: number
  /** 8 ビットから英数字に変更した方が効率の良いパターン */
  protected eightBitToAlphaPattern: RegExp

  /** 8 ビットから数字に変更した方が効率の良い文字数 */
  protected thresholdEightBitToNumeric: number
  /** 8 ビットから数字に変更した方が効率の良いパターン */
  protected eightBitToNumericPattern: RegExp

  /** 英数字から数字に変更した方が効率の良い文字数 */
  protected thresholdAlphaToNumeric: number
  /** 英数字から数字に変更した方が効率の良いパターン */
  protected alphaToNumericPattern: RegExp

  constructor(
    protected struct: QRStruct,
    protected level: number,
    protected data: string,
    protected firstCharset: SupportedMode,
    protected encoder: EightBitEncoder,
    protected useEci: boolean
  ) {
    this.thresholdEightBitToAlpha = QR.s(struct.type, 11, 15, 16)

    this.eightBitToAlphaPattern = new RegExp(
      "([A-Z0-9 $%*+\\-./:]{" + this.thresholdEightBitToAlpha + ",})"
    )

    this.thresholdEightBitToNumeric = QR.s(struct.type, 6, 8, 9)

    this.eightBitToNumericPattern = new RegExp(
      "([0-9]{" + this.thresholdEightBitToNumeric + ",})"
    )

    this.thresholdAlphaToNumeric = QR.s(struct.type, 13, 15, 17)

    this.alphaToNumericPattern = new RegExp(
      "[0-9]{" + this.thresholdAlphaToNumeric + ",}"
    )
  }

  try(): EncodeResult {
    const ret: EncodeResult = {
      success: false,
      data: [new ByteArrayBuilder()],
      division: 1,
    }

    if (this.struct.division > 1) {
      ret.data[ret.division - 1].addBinary(0, LEN_HEADER_BLOCK)
    }

    /** 最大データ長 */
    const mLen = maxDataLen[this.level][this.struct.type - 1]

    /** 現在の符号化種類 */
    let cType = this.firstCharset

    /** 未処理分の文字列 */
    let cStr = this.data

    this.addEciHeader(ret.data[ret.division - 1])

    for (;;) {
      if (cStr === "") {
        ret.success = true
        break
      }

      /** 文字数カウント指示子 桁数 */
      const len = QR.s(
        this.struct.type,
        strLenSpecLength[cType][0],
        strLenSpecLength[cType][1],
        strLenSpecLength[cType][2]
      )

      let n = ret.data[ret.division - 1].bitLength + LEN_MODE_SPECIFIER + len

      if (mLen - n < minLength(cType)) {
        if (this.struct.division <= ret.division) {
          // 分割上限を超えた場合は失敗を返す
          return ret
        }
        // シンボル追加
        ret.division++
        ret.data[ret.division - 1] = new ByteArrayBuilder()
        ret.data[ret.division - 1].addBinary(0, LEN_HEADER_BLOCK)

        this.addEciHeader(ret.data[ret.division - 1])

        n = ret.data[ret.division - 1].bitLength + LEN_MODE_SPECIFIER + len
        cType = detectFirstCharset(cStr, this.struct.type)
        continue
      }

      const push = (task: (ba: ByteArrayBuilder) => number): string => {
        const len = task(ret.data[ret.division - 1])
        cStr = cStr.substr(len)
        return cStr
      }

      /** シンボルの残りビット数 */
      const l = mLen - n

      if (cType === ModeSpecifier.Number) {
        cType = this.encodeNumber(push, cStr, l, len)
      } else if (cType === ModeSpecifier.Alphabet) {
        cType = this.encodeAlphabet(push, cStr, l, len)
      } else {
        cType = this.encodeEightBitByte(push, cStr, l, len)
      }
    }

    return ret
  }

  protected addEciHeader(ba: ByteArrayBuilder): void {
    const eci = this.encoder.getEciSpecifier()
    if (eci.length > 0 && this.useEci) {
      ba.addBinary(ModeSpecifier.ECI, 4)
      ba.addBinStr(eci)
    }
  }

  /**
   * 数字モードで符号化します。
   */
  protected encodeNumber(
    push: (task: (ba: ByteArrayBuilder) => number) => string,
    cStr: string,
    l: number,
    len: number
  ): SupportedMode {
    const a = freeLengthInNumeric(l)
    const matches = cStr.match(new RegExp("^[0-9]{1," + a + "}"))
    if (matches === null) {
      throw new Error("異常な状態遷移が発生しました")
    }
    const str = String(matches)
    const rStr = push((ba) => {
      ba.addBinary(ModeSpecifier.Number, 4)
      ba.addBinary(str.length, len)
      encodeNumber(ba, str)
      return str.length
    })

    if (rStr.match(ALPHABET_PATTERN) !== null) {
      // 数字以外の英字が来る場合は、英数字モードに切り替え
      return ModeSpecifier.Alphabet
    } else if (rStr.match(EIGHT_BIT_PATTERN) !== null) {
      // 英数字以外の場合は8ビットバイトモードに切り替え
      return ModeSpecifier.EightBit
    }
    return ModeSpecifier.Number
  }

  /**
   * 英数字モードで符号化します。
   */
  protected encodeAlphabet(
    push: (task: (ba: ByteArrayBuilder) => number) => string,
    cStr: string,
    l: number,
    len: number
  ): SupportedMode {
    const a = freeLengthInAlphabet(l)

    // 一定以上の数字の羅列がある場合は、数字モードで符号化する
    const nMatches = cStr.match(this.alphaToNumericPattern)
    if (nMatches !== null) {
      const str = cStr.substr(0, cStr.indexOf(nMatches[0]))
      const alphaLen = countAlphabet(str)

      const free = freeLengthInNumeric(
        l - (alphaLen + LEN_MODE_SPECIFIER + len)
      )
      if (alphaLen <= l && free >= this.thresholdAlphaToNumeric) {
        push((ba) => {
          ba.addBinary(ModeSpecifier.Alphabet, 4)
          ba.addBinary(str.length, len)
          encodeAlphabet(ba, str)
          return str.length
        })
        return ModeSpecifier.Number
      }
    }

    const matches = cStr.match(new RegExp("^[A-Z0-9 $%*+\\-./:]{1," + a + "}"))
    if (matches === null) {
      throw new Error("異常な状態遷移が発生しました")
    }
    const str = String(matches)

    const rStr = push((ba) => {
      ba.addBinary(ModeSpecifier.Alphabet, 4)
      ba.addBinary(str.length, len)
      encodeAlphabet(ba, str)
      return str.length
    })

    if (rStr.match(EIGHT_BIT_PATTERN) !== null) {
      return ModeSpecifier.EightBit
    }
    return ModeSpecifier.Alphabet
  }

  /**
   * 8ビットバイトモードで符号化します。
   */
  protected encodeEightBitByte(
    push: (task: (ba: ByteArrayBuilder) => number) => string,
    cStr: string,
    l: number,
    len: number
  ): SupportedMode {
    const a = Math.floor(l / LEN_EIGHT_BIT) // パートの残りバイト数

    // 一定以上の数字の羅列がある場合は、数字モードで符号化する
    const nMatches = cStr.match(this.eightBitToNumericPattern)
    const aMatches = cStr.match(this.eightBitToAlphaPattern)
    if (nMatches !== null) {
      const pos = cStr.indexOf(nMatches[1])

      // 英字の条件の方が先にマッチしていればそちらを優先
      if (aMatches === null || pos <= cStr.indexOf(aMatches[1])) {
        const val = cStr.substr(0, pos)
        const bytes = this.encoder.len(val)

        const free = freeLengthInNumeric(
          l - (bytes * LEN_EIGHT_BIT + LEN_MODE_SPECIFIER + len)
        )
        if (bytes <= a && free >= this.thresholdEightBitToNumeric) {
          push((ba) => {
            ba.addBinary(ModeSpecifier.EightBit, 4)
            ba.addBinary(bytes, len)
            this.encoder.toBinary(ba, val)
            return val.length
          })
          return ModeSpecifier.Number
        }
      }
    }

    // 一定以上の英数字の羅列がある場合は、英数字モードで符号化する
    if (aMatches !== null) {
      const pos = cStr.indexOf(aMatches[1])
      const val = cStr.substr(0, pos)
      const bytes = this.encoder.len(val)

      const free = freeLengthInAlphabet(
        l - (bytes * LEN_EIGHT_BIT + LEN_MODE_SPECIFIER + len)
      )
      if (bytes <= a && free >= this.thresholdEightBitToAlpha) {
        push((ba) => {
          ba.addBinary(ModeSpecifier.EightBit, 4)
          ba.addBinary(bytes, len)
          this.encoder.toBinary(ba, val)
          return val.length
        })
        return ModeSpecifier.Alphabet
      }
    }

    const ret = this.split8Bit(cStr, a)
    push((ba) => {
      ba.addBinary(ModeSpecifier.EightBit, 4)
      ba.addBinary(ret.bytes, len)
      this.encoder.toBinary(ba, ret.value)
      return ret.value.length
    })
    return ModeSpecifier.EightBit
  }

  /**
   * 指定文字列の先頭から指定した長さの文字列を返却します。
   * @param str
   * @param limit 最大長（バイト）
   */
  protected split8Bit(
    str: string,
    limit: number
  ): { bytes: number; value: string } {
    let bytes = 0
    let value = ""
    while (str.length > value.length) {
      const char = str[value.length]
      const cl = this.encoder.len(char)
      if (bytes + cl > limit) break
      bytes += cl
      value += char
    }

    return {
      bytes,
      value,
    }
  }
}

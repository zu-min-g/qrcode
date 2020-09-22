/* eslint-disable @typescript-eslint/ban-ts-comment */
import { EccLevel } from "../../../src"
import { ByteArrayBuilder } from "../../../src/core/ByteArrayBuilder"
import { ModeSpecifier } from "../../../src/core/ModeSpecifier"
import { BasicEncoder, Utf8 } from "../../../src/encoder"
import {
  minLength,
  freeLengthInAlphabet,
  freeLengthInNumeric,
  countAlphabet,
  countNumber,
  TryBasicEncode,
} from "../../../src/encoder/BasicEncoder"

describe("初期モード選択", () => {
  it("数字から始まる＆数字モード開始、途中で英字に変更", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "0000000A", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0001, 4) // numbers
    ba.addBinary(0b0000000111, 10) // 7 chars
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000, 4) // 0
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000000001, 9) // 1 char
    ba.addBinary(0b001010, 6) // A
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("数字から始まる＆英字モード開始", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "000000A", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000000111, 9) // 7 chars
    ba.addBinary(0b0000000000, 11) // 00
    ba.addBinary(0b0000000000, 11) // 00
    ba.addBinary(0b0000000000, 11) // 00
    ba.addBinary(0b001010, 6) // A
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("数字から始まる＆8ビットバイトモード開始", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "000あ", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000110, 8) // 6 bytes
    ba.addBinary(0x30, 8) // 0
    ba.addBinary(0x30, 8) // 0
    ba.addBinary(0x30, 8) // 0
    ba.addBinary(0xe38182, 24) // あ
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("数字から始まる＆数字モード開始、途中で8ビットバイトに変更", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "0000あ", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0001, 4) // numbers
    ba.addBinary(0b0000000100, 10) // 4 chars
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000, 4) // 0
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000011, 8) // 3 bytes
    ba.addBinary(0xe38182, 24) // あ
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("英字から始まる＆英字モード開始", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "AAAAAAあ", 1)
    expect(encoder.predictDataSize()).toBe(57)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000000110, 9) // 6 chars
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000011, 8) // 3 bytes
    ba.addBinary(0xe38182, 24) // あ
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("英字から始まる＆8ビットバイトモード開始", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "AAAAAあ", 1)
    expect(encoder.predictDataSize()).toBe(52)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00001000, 8) // 8 bytes
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0xe38182, 24) // あ
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("英字から始まる＆英字モード開始、途中で数字モード切替", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "A0000000000000", 1)
    expect(encoder.predictDataSize()).toBe(67)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000000001, 9) // 1 chars
    ba.addBinary(0b001010, 6) // A
    ba.addBinary(0b0001, 4) // numbers
    ba.addBinary(0b0000001101, 10) // 13 chars
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000, 4) // 0
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("8ビットバイトモードから始まる＆8ビットバイトモード開始、途中で数字モード切替", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "あ000000", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000011, 8) // 3 bytes
    ba.addBinary(0xe38182, 24) // あ
    ba.addBinary(0b0001, 4) // numbers
    ba.addBinary(0b0000000110, 10) // 6 chars
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000000000, 10) // 000
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("8ビットバイトモードから始まる＆8ビットバイトモード開始、途中で数字、英字モード切替", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "あ000000AAAAA", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000011, 8) // 3 bytes
    ba.addBinary(0xe38182, 24) // あ
    ba.addBinary(0b0001, 4) // numbers
    ba.addBinary(0b0000000110, 10) // 6 chars
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0000000000, 10) // 000
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000000101, 9) // 5 chars
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b001010, 6) // A
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("8ビットバイトモードから始まる＆8ビットバイトモード開始、途中で英字モード切替(数字より優先されること)", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "あAAAAA000000", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000011, 8) // 3 bytes
    ba.addBinary(0xe38182, 24) // あ
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000001011, 9) // 11 chars
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111000010, 11) // A0
    ba.addBinary(0b00000000000, 11) // 00
    ba.addBinary(0b00000000000, 11) // 00
    ba.addBinary(0b0000000, 6) // 0
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
  it("8ビットバイトモードから始まる＆8ビットバイトモード開始、途中で英字モード切替", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "あAAAAAAAAAAA", 1)
    const ret = encoder.try({
      division: 1,
      type: 1,
    })
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000011, 8) // 3 bytes
    ba.addBinary(0xe38182, 24) // あ
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000001011, 9) // 11 chars
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b001010, 6) // A
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())
  })
})

describe("連接QRを跨ぐ場合", () => {
  it("英数字モードから数字にする判定が出たが、シンボルを跨ぐ場合", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.L, "AAAAAAAAAAAAAAAAAAA0000000000000", 1)
    const ret = encoder.try({
      division: 2,
      type: 1,
    })
    // 152
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0, 20)
    ba.addBinary(0b0010, 4) // alphabets
    ba.addBinary(0b000010101, 9) // 21 chars
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111001100, 11) // AA
    ba.addBinary(0b00111000010, 11) // A0
    ba.addBinary(0b000000, 6) // 0
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())

    const ba2 = new ByteArrayBuilder()
    ba2.addBinary(0, 20)
    ba2.addBinary(0b0001, 4) // numbers
    ba2.addBinary(0b0000001011, 10) // 11 chars
    ba2.addBinary(0b0000000000, 10) // 000
    ba2.addBinary(0b0000000000, 10) // 000
    ba2.addBinary(0b0000000000, 10) // 000
    ba2.addBinary(0b0000000, 7) // 00
    expect(ret.data[1].toByteArray()).toStrictEqual(ba2.toByteArray())
  })

  it("8ビットバイトモードから数字にする判定が出たが、シンボルを跨ぐ場合", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.H, "あ000000", 1)
    const ret = encoder.try({
      division: 2,
      type: 1,
    })
    // 72
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0, 20)
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00000101, 8) // 5 bytes
    ba.addBinary(0xe38182, 24) // あ
    ba.addBinary(0x30, 8) // 0
    ba.addBinary(0x30, 8) // 0
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())

    const ba2 = new ByteArrayBuilder()
    ba2.addBinary(0, 20)
    ba2.addBinary(0b0001, 4) // numbers
    ba2.addBinary(0b0000000100, 10) // 4 chars
    ba2.addBinary(0b0000000000, 10) // 000
    ba2.addBinary(0b0000, 4) // 0
    expect(ret.data[1].toByteArray()).toStrictEqual(ba2.toByteArray())
  })

  it("8ビットバイトモードから英字にする判定が出たが、シンボルを跨ぐ場合", () => {
    const encoder = new BasicEncoder(new Utf8(), false)
    encoder.initialize(EccLevel.Q, "あAAAAAAAAAAA", 1)
    const ret = encoder.try({
      division: 2,
      type: 1,
    })
    // 72 104
    expect(ret.success).toBe(true)
    const ba = new ByteArrayBuilder()
    ba.addBinary(0, 20)
    ba.addBinary(0b0100, 4) // 8 bit encoding
    ba.addBinary(0b00001001, 8) // 9 bytes
    ba.addBinary(0xe38182, 24) // あ
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    ba.addBinary(0x41, 8) // A
    expect(ret.data[0].toByteArray()).toStrictEqual(ba.toByteArray())

    const ba2 = new ByteArrayBuilder()
    ba2.addBinary(0, 20)
    ba2.addBinary(0b0010, 4) // alphabets
    ba2.addBinary(0b000000101, 9) // 5 chars
    ba2.addBinary(0b00111001100, 11) // AA
    ba2.addBinary(0b00111001100, 11) // AA
    ba2.addBinary(0b001010, 6) // A
    expect(ret.data[1].toByteArray()).toStrictEqual(ba2.toByteArray())
  })
})

describe("異常なモード遷移", () => {
  it("異常なモード遷移", () => {
    const encoder = new TryBasicEncode(
      {
        division: 1,
        type: 1,
      },
      EccLevel.L,
      "",
      ModeSpecifier.Alphabet,
      new Utf8(),
      false
    )
    const ba = new ByteArrayBuilder()
    const push = (task: (ba: ByteArrayBuilder) => number): string => {
      task(ba)
      return ""
    }

    expect(() => {
      // @ts-ignore
      encoder.encodeAlphabet(push, "あ", 100, 8)
    }).toThrow()

    expect(() => {
      // @ts-ignore
      encoder.encodeNumber(push, "A", 100, 8)
    }).toThrow()
  })
})

describe("その他関数", () => {
  it("minLength", () => {
    expect(minLength(ModeSpecifier.Number)).toBe(4)
    expect(minLength(ModeSpecifier.Alphabet)).toBe(6)
    expect(minLength(ModeSpecifier.EightBit)).toBe(8)
  })
  it("freeLengthInAlphabet", () => {
    expect(freeLengthInAlphabet(17)).toBe(3)
    expect(freeLengthInAlphabet(11)).toBe(2)
    expect(freeLengthInAlphabet(10)).toBe(1)
    expect(freeLengthInAlphabet(6)).toBe(1)
    expect(freeLengthInAlphabet(5)).toBe(0)
    expect(freeLengthInAlphabet(0)).toBe(0)
  })
  it("freeLengthInNumeric", () => {
    expect(freeLengthInNumeric(14)).toBe(4)
    expect(freeLengthInNumeric(10)).toBe(3)
    expect(freeLengthInNumeric(9)).toBe(2)
    expect(freeLengthInNumeric(7)).toBe(2)
    expect(freeLengthInNumeric(6)).toBe(1)
    expect(freeLengthInNumeric(4)).toBe(1)
    expect(freeLengthInNumeric(3)).toBe(0)
    expect(freeLengthInNumeric(0)).toBe(0)
  })
  it("countAlphabet", () => {
    expect(countAlphabet("AAAA")).toBe(22)
    expect(countAlphabet("AAA")).toBe(17)
    expect(countAlphabet("AA")).toBe(11)
    expect(countAlphabet("A")).toBe(6)
    expect(countAlphabet("")).toBe(0)
  })
  it("countNumber", () => {
    expect(countNumber("111111")).toBe(20)
    expect(countNumber("11111")).toBe(17)
    expect(countNumber("1111")).toBe(14)
    expect(countNumber("111")).toBe(10)
    expect(countNumber("11")).toBe(7)
    expect(countNumber("1")).toBe(4)
    expect(countNumber("")).toBe(0)
  })
})

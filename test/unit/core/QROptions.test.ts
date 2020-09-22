import { EccLevel, isEccLevel, isQROptions } from "../../../src"
import { BasicEncoder, Uni2Sjis } from "../../../src/encoder"

describe("isQROptions", () => {
  it("object 以外の場合", () => {
    expect(isQROptions(true)).toBe(false)
  })

  it("空の場合", () => {
    expect(isQROptions({})).toBe(true)
  })

  it("指定有の場合", () => {
    expect(
      isQROptions({
        type: 1,
        level: EccLevel.L,
        division: 1,
        encoder: {},
        debug: true,
        mask: 1,
      })
    ).toBe(true)
  })

  it("type が不正の場合", () => {
    expect(
      isQROptions({
        type: true,
      })
    ).toBe(false)
  })

  it("level が不正の場合", () => {
    expect(
      isQROptions({
        level: true,
      })
    ).toBe(false)
  })

  it("division が不正の場合", () => {
    expect(
      isQROptions({
        division: true,
      })
    ).toBe(false)
  })

  it("encoder に Encoder オブジェクトを指定", () => {
    expect(
      isQROptions({
        encoder: new BasicEncoder(new Uni2Sjis()),
      })
    ).toBe(true)
  })

  it("encoder が不正の場合", () => {
    expect(
      isQROptions({
        encoder: false,
      })
    ).toBe(false)
  })

  it("debug が不正の場合", () => {
    expect(
      isQROptions({
        debug: 1,
      })
    ).toBe(false)
  })

  it("mask が不正の場合", () => {
    expect(
      isQROptions({
        mask: true,
      })
    ).toBe(false)
  })
})

describe("isEccLevel", () => {
  it("number 以外を指定した場合", () => {
    expect(isEccLevel(true)).toBe(false)
  })

  it("EccLevel を指定した場合", () => {
    expect(isEccLevel(EccLevel.L)).toBe(true)
    expect(isEccLevel(EccLevel.M)).toBe(true)
    expect(isEccLevel(EccLevel.Q)).toBe(true)
    expect(isEccLevel(EccLevel.H)).toBe(true)
  })

  it("範囲外の数値を指定した場合", () => {
    expect(isEccLevel(-1)).toBe(false)
    expect(isEccLevel(4)).toBe(false)
  })
})

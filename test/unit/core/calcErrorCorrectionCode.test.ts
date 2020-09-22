import { EccLevel } from "../../../src"
import { calcErrorCorrectionCode } from "../../../src/core/calcErrorCorrectionCode"
import { rsBlock } from "../../../src/data"

describe("誤り訂正コード計算", () => {
  it("データコード語過不足チェック", () => {
    const rsBlockInfo = rsBlock[EccLevel.L][0][0]
    const dataLen = rsBlockInfo[2]
    calcErrorCorrectionCode(new Uint8ClampedArray(dataLen), rsBlockInfo)

    expect(() => {
      calcErrorCorrectionCode(new Uint8ClampedArray(dataLen - 1), rsBlockInfo)
    }).toThrow("データコード語が不足しています")

    expect(() => {
      calcErrorCorrectionCode(new Uint8ClampedArray(dataLen + 1), rsBlockInfo)
    }).toThrow("データコード語が不足しています")
  })

  it("途中計算で 0 が発生する入力", () => {
    const rsBlockInfo = rsBlock[EccLevel.L][0][0]
    const src = new Uint8ClampedArray([
      0b01000000,
      0b10110110,
      0b00010110,
      0b00010110,
      0b00010110,
      0b00010110,
      0b00100110,
      0b00100110,
      0b00100110,
      0b00100110,
      0b00110110,
      0b00110110,
      0b00110000,
      0b11101100,
      0b00010001,
      0b11101100,
      0b00010001,
      0b11101100,
      0b00010001,
    ])
    const actual = calcErrorCorrectionCode(src, rsBlockInfo)
    expect(actual).toStrictEqual(
      new Uint8ClampedArray([
        0b00000010,
        0b10111100,
        0b00011011,
        0b00100011,
        0b11000001,
        0b11001000,
        0b10110100,
      ])
    )
  })
})

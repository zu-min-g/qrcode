import { isEncoderOptions } from "../../../src/encoder"
import { createEncoder } from "../../../src/encoder/EncoderOptions"

describe("EncoderOptions", () => {
  it("isEncoderOptions", () => {
    expect(isEncoderOptions(undefined)).toBe(false)
    expect(isEncoderOptions({})).toBe(true)
    expect(
      isEncoderOptions({
        charset: "",
        useEci: true,
      })
    ).toBe(true)
    expect(
      isEncoderOptions({
        charset: true,
      })
    ).toBe(false)
    expect(
      isEncoderOptions({
        useEci: "",
      })
    ).toBe(false)
  })

  it("createEncoder", () => {
    // 例外が飛ばないこと
    createEncoder({})
    createEncoder({ charset: "Shift_JIS" })

    expect(() => {
      createEncoder({
        charset: "unknown",
      })
    }).toThrow("サポートしていない文字コードです")
  })
})

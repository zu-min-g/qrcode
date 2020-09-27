import { ByteArrayBuilder } from "../../../src"
import { Utf8 } from "../../../src/encoder"
import { TextEncoderPolyfill } from "../../../src/encoder/Utf8"

describe("Utf8", () => {
  it("length", () => {
    const a = new Utf8()
    const b = new Utf8(false)

    expect(a.len("a")).toBe(b.len("a"))
    expect(a.len("À")).toBe(b.len("À"))
    expect(a.len("あ")).toBe(b.len("あ"))
    expect(a.len("𠀋")).toBe(b.len("𠀋"))
    expect(a.len("🍺")).toBe(b.len("🍺"))
  })
  it("toBinary", () => {
    const a = new Utf8()
    const baA = new ByteArrayBuilder()
    const b = new Utf8(false)
    const baB = new ByteArrayBuilder()

    a.toBinary(baA, "aÀあ𠀋🍺")
    b.toBinary(baB, "aÀあ𠀋🍺")

    expect(baA.toByteArray()).toStrictEqual(baB.toByteArray())
  })
  it("length サポートしていない文字", () => {
    const te = new TextEncoderPolyfill()
    expect(() => {
      te.utf8Len(0x110000)
    }).toThrow("サポートしていない文字が含まれます。")
  })
  it("toBinary サポートしていない文字", () => {
    const te = new TextEncoderPolyfill()
    const ba = new ByteArrayBuilder()
    expect(() => {
      te.uni2utf8(ba, 0x110000)
    }).toThrow("サポートしていない文字が含まれます。")
  })
})

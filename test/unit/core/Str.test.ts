import * as Str from "../../../src/core/Str"
import { Utf8 } from "../../../src/encoder"

describe("Str", () => {
  it("pad", () => {
    expect(Str.pad("1", 3)).toBe("001")

    expect(Str.pad("1", 3, "0", "left")).toBe("001")
    expect(Str.pad("1", 3, "0", "right")).toBe("100")
    expect(Str.pad("1", 5, "0", "both")).toBe("00100")

    expect(Str.pad("1", 3, "02", "left")).toBe("021")
    expect(Str.pad("1", 3, "02", "right")).toBe("102")
    expect(Str.pad("1", 5, "02", "both")).toBe("02102")
  })

  test.each([
    ["aaaa", 2, 2, "aa"],
    ["あ", 2, 0, ""],
    ["🍺", 4, 4, "🍺"],
    ["🍺", 3, 0, ""],
  ])(
    "split8Bit %s %i",
    (input: string, limit: number, expectedLen: number, expected: string) => {
      const encoder = new Utf8()
      const ret = Str.split8Bit(input, limit, encoder)
      expect(ret.bytes).toBe(expectedLen)
      expect(ret.value).toBe(expected)
    }
  )
})

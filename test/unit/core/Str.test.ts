import * as Str from "../../../src/core/Str"

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
})

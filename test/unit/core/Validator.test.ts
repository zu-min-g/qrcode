import { isValidType } from "../../../src/core/Validator"

describe("isValidType", () => {
  it("通常ケース", () => {
    expect(isValidType(undefined, ["undefined", "object"])).toBe(true)
    expect(isValidType({}, ["undefined", "object"])).toBe(true)
    expect(isValidType(true, ["undefined", "object"])).toBe(false)
  })
  it("追加検証", () => {
    // undefined の場合は追加検証をスキップする
    expect(
      isValidType(undefined, ["undefined", "object"], () => {
        return false
      })
    ).toBe(true)

    expect(
      isValidType({}, ["undefined", "object"], () => {
        return false
      })
    ).toBe(false)
    expect(
      isValidType({}, ["undefined", "object"], () => {
        return true
      })
    ).toBe(true)
  })
})

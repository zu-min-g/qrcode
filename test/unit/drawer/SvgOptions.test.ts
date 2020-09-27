import { isSvgOptions } from "../../../src"

describe("SvgOptions", () => {
  it("isSvgOptions", () => {
    expect(isSvgOptions({})).toBe(true)
    expect(
      isSvgOptions({
        idPrefix: "",
        thickness: 1,
        color: "",
        backgroundColor: "",
        flipHorizontal: true,
        transparent: true,
      })
    ).toBe(true)
  })
  expect(isSvgOptions(false)).toBe(false)
  expect(
    isSvgOptions({
      idPrefix: true,
    })
  ).toBe(false)
  expect(
    isSvgOptions({
      thickness: true,
    })
  ).toBe(false)
  expect(
    isSvgOptions({
      color: true,
    })
  ).toBe(false)
  expect(
    isSvgOptions({
      backgroundColor: true,
    })
  ).toBe(false)
  expect(
    isSvgOptions({
      flipHorizontal: "",
    })
  ).toBe(false)
  expect(
    isSvgOptions({
      transparent: "",
    })
  ).toBe(false)
})

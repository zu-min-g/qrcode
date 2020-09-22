import { isCanvasOptions } from "../../../src"

describe("CanvasOptions", () => {
  it("isCanvasOptions", () => {
    expect(isCanvasOptions({})).toBe(true)
    expect(
      isCanvasOptions({
        thickness: 1,
        color: "",
        autoResize: true,
        debug: true,
        backgroundColor: "",
        flipHorizontal: true,
        transparent: true,
      })
    ).toBe(true)
  })
  expect(isCanvasOptions(false)).toBe(false)
  expect(
    isCanvasOptions({
      thickness: true,
    })
  ).toBe(false)
  expect(
    isCanvasOptions({
      color: true,
    })
  ).toBe(false)
  expect(
    isCanvasOptions({
      autoResize: "",
    })
  ).toBe(false)
  expect(
    isCanvasOptions({
      debug: "",
    })
  ).toBe(false)
  expect(
    isCanvasOptions({
      backgroundColor: true,
    })
  ).toBe(false)
  expect(
    isCanvasOptions({
      flipHorizontal: "",
    })
  ).toBe(false)
  expect(
    isCanvasOptions({
      transparent: "",
    })
  ).toBe(false)
})

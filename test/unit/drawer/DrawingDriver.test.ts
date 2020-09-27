import { CanvasDrawer, DrawQR, isDrawingDriver } from "../../../src"
import { canvasMock } from "../../TestHelper"

describe("DrawingDriver", () => {
  it("isDrawingDriver", () => {
    expect(
      isDrawingDriver({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        draw: () => {},
      })
    ).toBe(true)
  })
  expect(isDrawingDriver(false)).toBe(false)
  expect(
    isDrawingDriver({
      draw: true,
    })
  ).toBe(false)

  const mock = canvasMock()
  expect(isDrawingDriver(new DrawQR(new CanvasDrawer(mock.canvas, {})))).toBe(
    true
  )
})

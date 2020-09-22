import { EventEmitter } from "events"
import { CanvasDrawer, CanvasOptions, EccLevel, generate } from "../../../src"
import { canvasMock } from "../../TestHelper"

describe("CanvasDrawer コンストラクタ", () => {
  it("デフォルト", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {})
    expect(cd.thickness).toBe(1)
    expect(cd.foreColor).toBe("rgb(0,0,0)")
    expect(cd.backgroundColor).toBe("rgb(255,255,255)")
    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    expect(cd.backAlpha).toBe(1)
  })
  it("不正な options", () => {
    const mock = canvasMock()
    expect(() => {
      new CanvasDrawer(mock.canvas, false as CanvasOptions)
    }).toThrow("options の指定に誤りがあります。型を確認してください。")
  })
  it("2D レンダリングをサポートしていない場合", () => {
    const canvas = new (jest.fn().mockImplementation(() => {
      return {
        getContext: () => {
          return null
        },
      }
    }))() as HTMLCanvasElement
    expect(() => {
      new CanvasDrawer(canvas, {})
    }).toThrow("2D レンダリングがサポートされていません")
  })
  it("オプション指定あり", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      thickness: 2,
      transparent: true,
      color: "#000",
      backgroundColor: "#fff",
      debug: true,
    })
    expect(cd.thickness).toBe(2)
    expect(cd.foreColor).toBe("#000")
    expect(cd.backgroundColor).toBe("#fff")
    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    expect(cd.backAlpha).toBe(0)
  })
})

describe("自動リサイズ", () => {
  it("型番1 分割無し 太さ1", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: true,
      thickness: 1,
    })

    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    expect(mock.canvas.width).toBe(21 + 4 + 4)
    expect(mock.canvas.height).toBe(21 + 4 + 4)
  })
  it("autoResize = false", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: false,
      thickness: 1,
    })

    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    expect(mock.canvas.width).toBeUndefined()
    expect(mock.canvas.height).toBeUndefined()
  })
  it("型番1 分割4 太さ1", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: true,
      thickness: 1,
    })

    cd.initialize(new EventEmitter(), {
      division: 4,
      type: 1,
    })
    expect(mock.canvas.width).toBe((21 + 4 + 4) * 2)
    expect(mock.canvas.height).toBe((21 + 4 + 4) * 2)
  })
})

describe("dot メソッド描画テスト", () => {
  it("dot 通常", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: true,
      thickness: 2,
    })

    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    mock.fillRect.mockReset()
    cd.dot(0, 1, 1)

    expect(mock.fillRect.mock.calls[0][0]).toBe((4 + 1) * 2) // x
    expect(mock.fillRect.mock.calls[0][1]).toBe((4 + 1) * 2) // y
    expect(mock.fillRect.mock.calls[0][2]).toBe(2) // w
    expect(mock.fillRect.mock.calls[0][3]).toBe(2) // h
  })
  it("dot 左右反転", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: true,
      thickness: 2,
      flipHorizontal: true,
    })

    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    mock.fillRect.mockReset()
    cd.dot(0, 1, 1)

    expect(mock.fillRect.mock.calls[0][0]).toBe((4 + 19) * 2) // x
    expect(mock.fillRect.mock.calls[0][1]).toBe((4 + 1) * 2) // y
    expect(mock.fillRect.mock.calls[0][2]).toBe(2) // w
    expect(mock.fillRect.mock.calls[0][3]).toBe(2) // h
  })
})

describe("fillRect メソッド描画テスト", () => {
  it("fillRect 通常", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: true,
      thickness: 2,
    })

    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    mock.fillRect.mockReset()
    cd.fillRect(0, 1, 2, 3, 4)

    expect(mock.fillRect.mock.calls[0][0]).toBe((4 + 1) * 2) // x
    expect(mock.fillRect.mock.calls[0][1]).toBe((4 + 2) * 2) // y
    expect(mock.fillRect.mock.calls[0][2]).toBe(3 * 2) // w
    expect(mock.fillRect.mock.calls[0][3]).toBe(4 * 2) // h
  })
  it("fillRect 左右反転", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {
      autoResize: true,
      thickness: 2,
      flipHorizontal: true,
    })

    cd.initialize(new EventEmitter(), {
      division: 1,
      type: 1,
    })
    mock.fillRect.mockReset()
    cd.fillRect(0, 1, 2, 3, 4)

    expect(mock.fillRect.mock.calls[0][0]).toBe((4 + 21 - 3 - 1) * 2) // x
    expect(mock.fillRect.mock.calls[0][1]).toBe((4 + 2) * 2) // y
    expect(mock.fillRect.mock.calls[0][2]).toBe(3 * 2) // w
    expect(mock.fillRect.mock.calls[0][3]).toBe(4 * 2) // h
  })
})

describe("CanvasDrawer その他メソッド", () => {
  it("recycle は未サポート", () => {
    const mock = canvasMock()
    const cd = new CanvasDrawer(mock.canvas, {})
    expect(() => {
      cd.recycle()
    }).toThrow("サポートしていない操作です")
  })

  it("toDataUri オプション指定なし", () => {
    const mock = canvasMock()
    mock.toBlob.mockImplementation(
      (cb: (uri: Blob | null) => void, type: unknown, quality: unknown) => {
        cb(new Blob())
        expect(type).toBe("image/png")
        expect(quality).toBeUndefined()
      }
    )
    const cd = new CanvasDrawer(mock.canvas, {})

    return cd.toDataUri().then(() => {
      // 何もしない
    })
  })

  it("toDataUri", () => {
    const mock = canvasMock()
    mock.toBlob.mockImplementation(
      (cb: (uri: Blob | null) => void, type: unknown, quality: unknown) => {
        cb(new Blob())
        expect(type).toBe("image/jpeg")
        expect(quality).toBe(1)
      }
    )
    const cd = new CanvasDrawer(mock.canvas, {})
    return cd.toDataUri("image/jpeg", 1).then(() => {
      // 何もしない
    })
  })

  it("toDataUri blob が null を返した場合", () => {
    const mock = canvasMock()
    mock.toBlob.mockImplementation(
      (cb: (uri: Blob | null) => VideoFacingModeEnum) => {
        cb(null)
      }
    )
    expect.assertions(1)
    const cd = new CanvasDrawer(mock.canvas, {})
    return cd.toDataUri("image/jpeg", 1).catch(() => {
      expect(1).toBe(1)
    })
  })
})

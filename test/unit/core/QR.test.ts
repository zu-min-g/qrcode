/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  generate,
  MemoryDrawer,
  QR,
  EccLevel,
  TYPE_MAX,
  DIVISION_MAX,
  DIVISION_MIN,
  TYPE_MIN,
  QROptions,
  ByteArrayBuilder,
  deserializeQrData,
  serializeQrData,
} from "../../../src"
import { copyQRData } from "../../../src/core/QRStruct"
import * as Str from "../../../src/core/Str"
import * as Arr from "../../../src/core/Arr"
import { maxDataLen } from "../../../src/data"
import { canvasMock } from "../../TestHelper"

describe("QR.ts コンストラクタ", () => {
  it("デフォルト値", () => {
    const qr = new QR("1", {})
    expect(qr.type).toBe(1)
    expect(qr.level).toBe(EccLevel.L)
    expect(qr.division).toBe(1)
    expect(qr.debug).toBe(false)
  })

  it("オプション指定有", () => {
    // 分割できるほど十分の長さの文字列
    const data = "abcdefghijklmnopqrstuvwxyz"

    const qr = generate(data, {
      type: 2,
      level: EccLevel.Q,
      division: 2,
      debug: false,
      encoder: {
        charset: "utf-8",
        useEci: true,
      },
    })
    expect(qr.type).toBe(2)
    expect(qr.level).toBe(EccLevel.Q)
    expect(qr.division).toBe(2)
    expect(qr.debug).toBe(false)
  })

  it("最大値", () => {
    const qr = new QR("1", {
      type: TYPE_MAX,
      level: EccLevel.Q,
      division: DIVISION_MAX,
    })
    expect(qr.type).toBe(TYPE_MAX)
    expect(qr.level).toBe(EccLevel.Q)
    expect(qr.division).toBe(DIVISION_MAX)
  })

  it("最大値 + 1", () => {
    const qr = new QR("1", {
      type: TYPE_MAX + 1,
      division: DIVISION_MAX + 1,
    })
    expect(qr.type).toBe(TYPE_MAX)
    expect(qr.division).toBe(DIVISION_MAX)
  })

  it("最小値 - 1", () => {
    const qr = new QR("1", {
      type: TYPE_MIN - 1,
      division: DIVISION_MIN - 1,
    })
    expect(qr.type).toBe(TYPE_MIN)
    expect(qr.division).toBe(DIVISION_MIN)
  })

  it("データが空の場合", () => {
    expect(() => {
      new QR("", {})
    }).toThrow()
  })

  it("データの型が不正", () => {
    expect(() => {
      new QR((1 as unknown) as string, {})
    }).toThrow()
  })

  it("options が不正", () => {
    expect(() => {
      new QR("", (false as unknown) as QROptions)
    }).toThrow()
  })

  it("デバッグ有効の場合", () => {
    const qr = new QR("test", {
      debug: true,
    })
    expect(qr.debug).toBe(true)

    const spyLog = jest.spyOn(console, "log").mockImplementation()
    // @ts-ignore
    qr.debugOut("test")
    expect(console.log).toBeCalled()
    expect(spyLog.mock.calls[0][0]).toBe("test")
    spyLog.mockReset()
    spyLog.mockRestore()
  })
})

describe("QR.ts generate", () => {
  it("附属書G シンボルの符号化例より", () => {
    const qr = generate("01234567", {
      level: EccLevel.M,
    })
    expect(qr.type).toBe(1)
    expect(qr.level).toBe(EccLevel.M)
    expect(qr.division).toBe(1)
    expect(qr.masks[0]).toBe(2)
    const e = undefined

    // 図１より（行列が入れ替わっているので注意）
    const expected = [
      [e, e, e, e, e, e, e, e, e, 2, 2, 2, 2],
      [e, e, e, e, e, e, e, e, e, 1, 1, 1, 1],
      [e, e, e, e, e, e, e, e, e, 1, 2, 1, 1],
      [e, e, e, e, e, e, e, e, e, 1, 2, 2, 1],
      [e, e, e, e, e, e, e, e, e, 1, 1, 2, 2],
      [e, e, e, e, e, e, e, e, e, 2, 1, 1, 2],
      e,
      [e, e, e, e, e, e, e, e, e, 2, 2, 1, 2],
      [e, e, e, e, e, e, e, e, e, 2, 1, 1, 2],
      [1, 1, 2, 1, 2, 2, e, 2, 1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1],
      [1, 2, 1, 1, 2, 1, e, 1, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 2],
      [2, 2, 1, 1, 2, 1, e, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2],
      [1, 1, 2, 2, 1, 1, e, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
      [e, e, e, e, e, e, e, e, e, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2],
      [e, e, e, e, e, e, e, e, e, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
      [e, e, e, e, e, e, e, e, e, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2],
      [e, e, e, e, e, e, e, e, e, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
      [e, e, e, e, e, e, e, e, e, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1],
      [e, e, e, e, e, e, e, e, e, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1],
      [e, e, e, e, e, e, e, e, e, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [e, e, e, e, e, e, e, e, e, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    ]

    expect(qr.codes[0]).toStrictEqual(Arr.deleteEmpty(expected))
    expect(qr.typeInfo).toBe(0)

    const drawer = new MemoryDrawer()
    qr.draw(drawer)

    // 図２より（行列が入れ替わっているので注意）
    const t = true
    const f = false
    const expectedQr = [
      [t, t, t, t, t, t, t, f, t, f, f, f, f, f, t, t, t, t, t, t, t],
      [t, f, f, f, f, f, t, f, f, f, f, f, f, f, t, f, f, f, f, f, t],
      [t, f, t, t, t, f, t, f, t, f, t, f, f, f, t, f, t, t, t, f, t],
      [t, f, t, t, t, f, t, f, t, t, f, f, t, f, t, f, t, t, t, f, t],
      [t, f, t, t, t, f, t, f, t, f, f, t, t, f, t, f, t, t, t, f, t],
      [t, f, f, f, f, f, t, f, t, t, f, f, t, f, t, f, f, f, f, f, t],
      [t, t, t, t, t, t, t, f, t, f, t, f, t, f, t, t, t, t, t, t, t],
      [f, f, f, f, f, f, f, f, f, t, t, f, t, f, f, f, f, f, f, f, f],
      [f, f, t, t, t, t, t, t, f, t, f, f, t, t, f, t, t, t, t, f, t],
      [t, t, f, t, f, f, f, f, t, f, t, t, f, f, t, f, f, t, f, f, t],
      [f, t, f, f, t, f, t, f, f, t, f, f, f, t, t, t, f, f, t, f, t],
      [t, t, f, f, t, f, f, t, f, f, t, f, t, t, f, t, f, f, t, f, t],
      [t, t, f, f, t, t, t, t, t, t, f, f, f, t, t, t, t, t, f, f, f],
      [f, f, f, f, f, f, f, f, f, f, t, f, t, t, f, t, f, f, t, f, t],
      [t, t, t, t, t, t, t, f, t, f, f, f, f, t, t, t, f, f, f, f, f],
      [t, f, f, f, f, f, t, f, t, t, f, t, f, f, t, f, t, t, f, t, f],
      [t, f, t, t, t, f, t, f, t, f, t, t, t, f, f, f, f, f, t, t, t],
      [t, f, t, t, t, f, t, f, t, t, t, t, f, t, f, f, t, f, f, f, f],
      [t, f, t, t, t, f, t, f, t, t, t, t, f, t, f, t, t, f, t, t, t],
      [t, f, f, f, f, f, t, f, f, f, t, f, f, f, f, f, f, f, f, t, f],
      [t, t, t, t, t, t, t, f, f, f, t, f, f, f, f, t, f, f, f, f, f],
    ]
    expect(drawer.data[0]).toStrictEqual(expectedQr)
  })

  it("パリティデータ", () => {
    const data = "あい"

    const qr = generate(data, {
      encoder: {
        charset: "utf-8",
      },
    })

    // E3 ^ 81 ^ 82 ^ E3 ^ 81 ^ 84 = 06
    // @ts-ignore
    expect(qr.calcParityData()).toBe(0b00000110)

    const qr2 = generate(data, {
      encoder: {
        charset: "shift_jis",
      },
    })

    // 82 ^ A0 ^ 82 ^ A2 = 02
    // @ts-ignore
    expect(qr2.calcParityData()).toBe(0b00000010)
  })

  it("最大長を超えた場合", () => {
    const data = Str.pad("", 424, "あ")
    const options: QROptions = {
      level: EccLevel.H,
      encoder: {
        charset: "utf-8",
        useEci: true,
      },
    }

    generate(data, options) // 最大長

    const qr = new QR(data + "あ", options) // 最大長 + 1 文字

    expect(() => {
      qr.generate()
    }).toThrow("データが大きすぎます。")
  })

  it("残余ビット7", () => {
    // 例外が発生しなければ OK
    generate("test", {
      type: 2,
    })
  })

  it("残余ビット3", () => {
    // 例外が発生しなければ OK
    generate("test", {
      type: 14,
    })
  })

  it("残余ビット4", () => {
    // 例外が発生しなければ OK
    generate("test", {
      type: 21,
    })
  })
})

describe("QR.ts コピー", () => {
  it("コピー QRStruct", () => {
    const data = "0"
    const qr = new QR(data, {})

    const copy = qr.getQRStruct()
    expect(copy.type).toBe(qr.type)
    expect(copy.division).toBe(qr.division)
  })

  it("コピー QRData deep", () => {
    const data = "0"
    const qr = generate(data, {})

    const copy = qr.getQRData()

    expect(copy.type).toBe(qr.type)
    expect(copy.division).toBe(qr.division)
    expect(copy.level).toBe(qr.level)
    expect(copy.typeInfo).toBe(qr.typeInfo)
    expect(copy.formatInfo).toStrictEqual(qr.formatInfo)
    expect(copy.masks).toStrictEqual(qr.masks)
    expect(copy.codes).toStrictEqual(qr.codes)

    // deep copy していること。
    // copy 側を変えても、 qr に反映されないこと。
    copy.formatInfo[0] = 2
    copy.masks[0]++
    copy.codes[0][0][0] = 1
    expect(copy.formatInfo).not.toStrictEqual(qr.formatInfo)
    expect(copy.masks).not.toStrictEqual(qr.masks)
    expect(copy.codes).not.toStrictEqual(qr.codes)
  })

  it("コピー QRData shallow", () => {
    const data = "0"
    const qr = generate(data, {})

    const copy = qr.getQRData(false)

    // shallow copy
    copy.formatInfo[0] = 2
    copy.masks[0]++
    copy.codes[0][0][0] = 1
    expect(copy.formatInfo).toStrictEqual(qr.formatInfo)
    expect(copy.masks).toStrictEqual(qr.masks)
    expect(copy.codes).toStrictEqual(qr.codes)
  })

  it("コピー QRData shallow", () => {
    const data = "0"
    const qr = generate(data, {})

    const copy = copyQRData(qr)

    // shallow copy
    copy.formatInfo[0] = 2
    expect(copy.formatInfo).not.toStrictEqual(qr.formatInfo)
  })
})

describe("シリアライズ", () => {
  it("シリアライズ前とデシリアライズ後の内容が等しいこと", () => {
    const qr = generate("0", {})
    const data = qr.getQRData()
    const json = serializeQrData(data)
    const actual = deserializeQrData(json)
    expect(actual).toStrictEqual(data)
  })
})

describe("QR.ts その他メソッド", () => {
  it("setDivision 最大を超えた場合", () => {
    const data = "0"
    const qr = new QR(data, {
      division: 1,
    })

    expect(() => {
      // @ts-ignore
      qr.setDivision(DIVISION_MAX + 1)
    }).toThrow()
  })
  it("padding 最大を超えた場合", () => {
    const spyLog = jest.spyOn(console, "log").mockImplementation()
    const qr = new QR("test", {
      type: 1,
      division: 1,
      level: EccLevel.L,
      debug: true,
    })
    const ba = new ByteArrayBuilder()
    ba.addBinStr(Str.pad("", maxDataLen[EccLevel.L][0], "0"))

    // @ts-ignore
    qr.padding(ba) // 最大長
    spyLog.mockReset()

    expect(() => {
      ba.addBit(0)
      // @ts-ignore
      qr.padding(ba) // 最大長 + 1
    }).toThrow()

    expect(console.log).toBeCalled()
    spyLog.mockReset()
    spyLog.mockRestore()
  })

  it("debug log", () => {
    const spyLog = jest.spyOn(console, "log").mockImplementation()
    const qr = new QR("test", {
      debug: true,
    })
    // @ts-ignore
    qr.debugBinary("content", 0b000000010, 9)

    expect(spyLog.mock.calls[0][0]).toStrictEqual({
      content: "content",
      binStr: "00000001 0",
    })

    // @ts-ignore
    qr.debugBinary("content2", 0, 0)

    expect(spyLog.mock.calls[1][0]).toStrictEqual({
      content: "content2",
      binStr: "0",
    })

    // @ts-ignore
    qr.debugBinStr("content3", "")

    expect(spyLog.mock.calls[2][0]).toStrictEqual({
      content: "content3",
      binStr: "",
    })

    spyLog.mockReset()
    spyLog.mockRestore()
  })

  it("debug log", () => {
    const spyLog = jest.spyOn(console, "log").mockImplementation()
    const qr = new QR("test", {
      debug: false,
    })
    // @ts-ignore
    qr.debugBinary("content", 0b000000010, 9)
    // @ts-ignore
    qr.debugBinStr("content3", "")
    expect(spyLog.mock.calls.length).toBe(0)

    spyLog.mockReset()
    spyLog.mockRestore()
  })
  it("drawToCanvas", () => {
    const mock = canvasMock()
    const qr = generate("test", {})
    qr.drawToCanvas(mock.canvas, {
      debug: true,
    })
  })
})

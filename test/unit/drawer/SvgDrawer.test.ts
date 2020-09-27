import { SvgOptions, SvgDrawer, generate } from "../../../src"
import { svgTemplate } from "../../../src/drawer/SvgDrawer"

describe("SvgDrawer コンストラクタ", () => {
  it("デフォルト", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {})
    expect(sd.idModule).toBe("qrSvgM")
    expect(sd.idDp).toBe("qrSvgD")
    expect(sd.idAp).toBe("qrSvgA")
    expect(sd.thickness).toBe(1)
    expect(sd.foreColor).toBe("rgb(0,0,0)")
    expect(sd.backgroundColor).toBe("rgb(255,255,255)")

    sd.initialize({
      division: 1,
      type: 1,
    })
  })
  it("不正な options", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    expect(() => {
      new SvgDrawer(svg, false as SvgOptions)
    }).toThrow("options の指定に誤りがあります。型を確認してください。")
  })
  it("オプション指定あり", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      thickness: 2,
      color: "#000",
      backgroundColor: "#fff",
      idPrefix: "test",
    })
    expect(sd.idModule).toBe("testM")
    expect(sd.idDp).toBe("testD")
    expect(sd.idAp).toBe("testA")
    expect(sd.thickness).toBe(2)
    expect(sd.foreColor).toBe("#000")
    expect(sd.backgroundColor).toBe("#fff")
    sd.initialize({
      division: 1,
      type: 1,
    })
  })
})

describe("自動リサイズ", () => {
  it("型番1 分割無し 太さ1", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      thickness: 1,
    })

    sd.initialize({
      division: 1,
      type: 1,
    })
    expect(svg.getAttribute("width")).toBe((21 + 4 + 4).toString())
    expect(svg.getAttribute("height")).toBe((21 + 4 + 4).toString())
  })
  it("型番1 分割4 太さ1", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      thickness: 1,
    })

    sd.initialize({
      division: 4,
      type: 1,
    })
    expect(svg.getAttribute("width")).toBe(((21 + 4 + 4) * 2).toString())
    expect(svg.getAttribute("height")).toBe(((21 + 4 + 4) * 2).toString())
  })
})

describe("defs＆背景テスト", () => {
  it("白背景", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      thickness: 1,
    })

    sd.initialize({
      division: 1,
      type: 1,
    })
    sd.begin(0)

    expect(sd.toString()).toBe(
      svgTemplate(
        "0 0 29 29",
        '<rect x="0" y="0" width="29" height="29" fill="rgb(255,255,255)" fill-opacity="1"></rect><defs><g id="qrSvgM"><rect width="1" height="1" x="0" y="0" fill="rgb(0,0,0)"></rect></g><g id="qrSvgD"><rect x="0.5" y="0.5" width="6" height="6" fill-opacity="0" stroke-width="1" stroke="rgb(0,0,0)"></rect><rect width="3" height="3" x="2" y="2" fill="rgb(0,0,0)"></rect></g><g id="qrSvgA"><rect x="0.5" y="0.5" width="4" height="4" fill-opacity="0" stroke-width="1" stroke="rgb(0,0,0)"></rect><rect width="1" height="1" x="2" y="2" fill="rgb(0,0,0)"></rect></g></defs><svg x="0" y="0"><rect x="0" y="0" width="29" height="29" fill="rgb(255,255,255)" fill-opacity="1"></rect></svg>'
      )
    )
  })
  it("透明", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      thickness: 1,
      transparent: true,
    })

    sd.initialize({
      division: 1,
      type: 1,
    })
    sd.begin(0)

    expect(sd.toString()).toBe(
      svgTemplate(
        "0 0 29 29",
        '<rect x="0" y="0" width="29" height="29" fill="rgb(255,255,255)" fill-opacity="0"></rect><defs><g id="qrSvgM"><rect width="1" height="1" x="0" y="0" fill="rgb(0,0,0)"></rect></g><g id="qrSvgD"><rect x="0.5" y="0.5" width="6" height="6" fill-opacity="0" stroke-width="1" stroke="rgb(0,0,0)"></rect><rect width="3" height="3" x="2" y="2" fill="rgb(0,0,0)"></rect></g><g id="qrSvgA"><rect x="0.5" y="0.5" width="4" height="4" fill-opacity="0" stroke-width="1" stroke="rgb(0,0,0)"></rect><rect width="1" height="1" x="2" y="2" fill="rgb(0,0,0)"></rect></g></defs><svg x="0" y="0"><rect x="0" y="0" width="29" height="29" fill="rgb(255,255,255)" fill-opacity="0"></rect></svg>'
      )
    )
  })
})

describe("flipHorizontal", () => {
  it("flipHorizontal off", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {})
    const qr = generate("test", {
      type: 7,
    })
    qr.draw(sd)
  })
  it("flipHorizontal on", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      flipHorizontal: true,
    })
    const qr = generate("test", {
      type: 7,
    })
    qr.draw(sd)
  })
})

describe("その他メソッド", () => {
  it("toDataUri", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const sd = new SvgDrawer(svg, {
      thickness: 1,
      transparent: true,
    })
    return sd.toDataUri().then((result) => {
      expect(result !== null).toBe(true)
    })
  })
})

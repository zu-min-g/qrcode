import { getSize } from "../core/QR"
import { QRStruct } from "../core/QRStruct"
import { defaultValue, isValidType } from "../core/Validator"
import { Drawer } from "./Drawer"

export interface SvgOptions {
  /** ID の接頭辞 */
  idPrefix?: string

  /** モジュールの大きさ(px) */
  thickness?: number

  /** 暗モジュールの色 */
  color?: string

  /** 明モジュールの色 */
  backgroundColor?: string

  /** 左右反転 */
  flipHorizontal?: boolean

  /** 背景を透明に */
  transparent?: boolean
}

export const svgTemplate = (viewBox: string | null, body: string): string => {
  return `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}">${body}</svg>`
}

export function isSvgOptions(obj: unknown): obj is SvgOptions {
  if (typeof obj !== "object") return false
  const options = obj as SvgOptions
  if (!isValidType(options.idPrefix, ["undefined", "string"])) return false
  if (!isValidType(options.thickness, ["undefined", "number"])) return false
  if (!isValidType(options.color, ["undefined", "string"])) return false
  if (!isValidType(options.backgroundColor, ["undefined", "string"]))
    return false
  if (!isValidType(options.flipHorizontal, ["undefined", "boolean"]))
    return false
  if (!isValidType(options.transparent, ["undefined", "boolean"])) return false
  return true
}

export class SvgDrawer implements Drawer {
  /** 余白（px） */
  public space: number

  /** ドットの大きさ(px) */
  public thickness = 1

  /** 前景色 */
  public foreColor = "rgb(0,0,0)"

  /** 背景色 */
  public backgroundColor = "rgb(255,255,255)"

  /** QR コードシンボルのサイズ */
  protected size = 0

  /** 列数 */
  public columns = 1

  /** 行数 */
  public rows = 1

  /** 左位置 */
  public left: number[] = []

  /** 上位置 */
  public top: number[] = []

  /** シンボル */
  public symbols: SVGElement[] = []

  /** モジュールのID */
  public idModule: string

  /** 位置検出パターンのID */
  public idDp: string

  /** 位置合わせパターンのID */
  public idAp: string

  constructor(private svg: SVGElement, private options: SvgOptions) {
    if (!isSvgOptions(options)) {
      throw new Error("options の指定に誤りがあります。型を確認してください。")
    }

    this.thickness = defaultValue(options.thickness, this.thickness)
    this.foreColor = defaultValue(options.color, this.foreColor)

    const idPrefix = defaultValue(options.idPrefix, "qrSvg")
    this.idModule = idPrefix + "M"
    this.idDp = idPrefix + "D"
    this.idAp = idPrefix + "A"

    this.backgroundColor = defaultValue(
      options.backgroundColor,
      this.backgroundColor
    )
    this.space = 4
  }

  /**
   * @inheritdoc
   */
  initialize(qr: QRStruct): void {
    this.size = getSize(qr.type)
    this.columns = Math.ceil(Math.sqrt(qr.division))
    this.rows = Math.ceil(qr.division / this.columns)
    const size = this.size + this.space * 2

    for (let index = 0; index < qr.division; index++) {
      this.left[index] = (index % this.columns) * size
      this.top[index] = Math.floor(index / this.columns) * size
    }

    this.clear()
    this.resize()
    this.fillBackground()
    this.define()
  }

  clear(): void {
    this.svg.innerHTML = ""
  }

  /**
   * @inheritdoc
   */
  subscribe(): void {
    // 何もしない
  }

  begin(index: number): void {
    const size = this.size + this.space * 2
    const svg = this.create("svg", this.svg)
    svg.setAttribute("x", this.left[index].toString())
    svg.setAttribute("y", this.top[index].toString())

    const rect = this.create("rect", svg)
    rect.setAttribute("x", "0")
    rect.setAttribute("y", "0")
    rect.setAttribute("width", size.toString())
    rect.setAttribute("height", size.toString())
    rect.setAttribute("fill", this.backgroundColor)
    rect.setAttribute("fill-opacity", this.options.transparent ? "0" : "1")
    this.symbols[index] = svg
  }

  end(index: number): void {
    this.svg.appendChild(this.symbols[index])
  }

  resize(): void {
    const viewSize = this.size + this.space * 2
    const sizeInPx = viewSize * this.thickness
    this.svg.setAttribute("width", (sizeInPx * this.columns).toString())
    this.svg.setAttribute("height", (sizeInPx * this.rows).toString())
    this.svg.setAttribute(
      "viewBox",
      "0 0 " + viewSize * this.columns + " " + viewSize * this.rows
    )
  }

  /**
   * 図形を定義する
   */
  define(): void {
    const defs = this.create("defs")

    this.defineModule(defs)
    this.defineDetectionPattern(defs)
    this.defineAlignmentPattern(defs)

    this.svg.appendChild(defs)
  }

  /**
   * モジュールを定義する
   */
  defineModule(defs: SVGElement): void {
    const g = this.create("g", defs)
    g.setAttribute("id", this.idModule)
    const module = this.create("rect", g)
    module.setAttribute("width", "1")
    module.setAttribute("height", "1")
    module.setAttribute("x", "0")
    module.setAttribute("y", "0")
    module.setAttribute("fill", this.foreColor)
  }

  /**
   * 位置検出パターン
   */
  defineDetectionPattern(defs: SVGElement): void {
    const g = this.create("g", defs)
    g.setAttribute("id", this.idDp)

    const outer = this.create("rect", g)
    outer.setAttribute("x", "0.5")
    outer.setAttribute("y", "0.5")
    outer.setAttribute("width", "6")
    outer.setAttribute("height", "6")
    outer.setAttribute("fill-opacity", "0")
    outer.setAttribute("stroke-width", "1")
    outer.setAttribute("stroke", this.foreColor)

    const inner = this.create("rect", g)
    inner.setAttribute("width", "3")
    inner.setAttribute("height", "3")
    inner.setAttribute("x", "2")
    inner.setAttribute("y", "2")
    inner.setAttribute("fill", this.foreColor)
  }

  /**
   * 位置合わせパターン
   */
  defineAlignmentPattern(defs: SVGElement): void {
    const g = this.create("g", defs)
    g.setAttribute("id", this.idAp)

    const outer = this.create("rect", g)
    outer.setAttribute("x", "0.5")
    outer.setAttribute("y", "0.5")
    outer.setAttribute("width", "4")
    outer.setAttribute("height", "4")
    outer.setAttribute("fill-opacity", "0")
    outer.setAttribute("stroke-width", "1")
    outer.setAttribute("stroke", this.foreColor)

    const inner = this.create("rect", g)
    inner.setAttribute("width", "1")
    inner.setAttribute("height", "1")
    inner.setAttribute("x", "2")
    inner.setAttribute("y", "2")
    inner.setAttribute("fill", this.foreColor)
  }

  /**
   * @inheritdoc
   */
  drawDetectionPattern(index: number, x: number, y: number): void {
    if (this.options.flipHorizontal) {
      x = this.size - x - 7
    }

    const use = this.createUse(this.idDp, this.symbols[index])
    use.setAttribute("x", (x + this.space).toString())
    use.setAttribute("y", (y + this.space).toString())
  }

  /**
   * @inheritdoc
   */
  drawAlignmentPattern(index: number, x: number, y: number): void {
    if (this.options.flipHorizontal) {
      x = this.size - x - 5
    }

    const use = this.createUse(this.idAp, this.symbols[index])
    use.setAttribute("x", (x + this.space).toString())
    use.setAttribute("y", (y + this.space).toString())
  }

  /**
   * @inheritDoc
   */
  drawModule(index: number, x: number, y: number): void {
    if (this.options.flipHorizontal) {
      x = this.size - x - 1
    }

    const use = this.createUse(this.idModule, this.symbols[index])
    use.setAttribute("x", (x + this.space).toString())
    use.setAttribute("y", (y + this.space).toString())
  }

  /**
   * 背景を塗りつぶします。
   */
  fillBackground(): void {
    const size = this.size + this.space * 2
    const rect = this.create("rect", this.svg)
    rect.setAttribute("x", "0")
    rect.setAttribute("y", "0")
    rect.setAttribute("width", (size * this.columns).toString())
    rect.setAttribute("height", (size * this.rows).toString())
    rect.setAttribute("fill", this.backgroundColor)
    rect.setAttribute("fill-opacity", this.options.transparent ? "0" : "1")
  }

  createUse(id: string, parent?: SVGElement): SVGUseElement {
    const use = this.create("use", parent) as SVGUseElement
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + id)

    return use
  }

  create(tagName: string, parent?: SVGElement): SVGElement {
    const rect = (document.createElementNS(
      "http://www.w3.org/2000/svg",
      tagName
    ) as unknown) as SVGElement

    if (typeof parent !== "undefined") {
      parent.appendChild(rect)
    }

    return rect
  }

  /**
   * 現在の SVG タグの内容を XML 形式で返却します。
   */
  toString(): string {
    const viewBox = this.svg.getAttribute("viewBox")
    const result = svgTemplate(viewBox, this.svg.innerHTML)
    return result
  }

  /**
   * 現在の SVG タグの内容を Blob に変換します。
   */
  toBlob(): Blob {
    return new Blob([this.toString()], {
      type: "image/svg+xml",
    })
  }

  /**
   * Data URI Scheme に変換します。
   */
  toDataUri(): Promise<string | null> {
    return new Promise((resolve) => {
      const blob = this.toBlob()
      const fileReader = new FileReader()
      fileReader.onload = () => {
        resolve(fileReader.result as string | null)
      }
      fileReader.readAsDataURL(blob)
    })
  }
}

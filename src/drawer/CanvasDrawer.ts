import { getSize } from "../core/QR"
import { EventEmitter } from "events"
import { BitmapDrawer } from "./BitmapDrawer"
import { defaultValue, isValidType } from "../core/Validator"
import { QRStruct } from "../core/QRStruct"

export interface CanvasOptions {
  /** モジュールの大きさ(px) */
  thickness?: number

  /** 暗モジュールの色 */
  color?: string

  /** キャンバスの大きさを QR コードの大きさに合わせてリサイズ */
  autoResize?: boolean

  /** デバッグモード */
  debug?: boolean

  /** 明モジュールの色 */
  backgroundColor?: string

  /** 左右反転 */
  flipHorizontal?: boolean

  /** 背景を透明に */
  transparent?: boolean
}

export function isCanvasOptions(obj: unknown): obj is CanvasOptions {
  if (typeof obj !== "object") return false
  const options = obj as CanvasOptions
  if (!isValidType(options.thickness, ["undefined", "number"])) return false
  if (!isValidType(options.color, ["undefined", "string"])) return false
  if (!isValidType(options.autoResize, ["undefined", "boolean"])) return false
  if (!isValidType(options.debug, ["undefined", "boolean"])) return false
  if (!isValidType(options.backgroundColor, ["undefined", "string"]))
    return false
  if (!isValidType(options.flipHorizontal, ["undefined", "boolean"]))
    return false
  if (!isValidType(options.transparent, ["undefined", "boolean"])) return false
  return true
}

/**
 * canvas タグに出力します。
 */
export class CanvasDrawer extends BitmapDrawer {
  /** 余白（px） */
  public space: number

  protected ctx: CanvasRenderingContext2D

  /** ドットの大きさ(px) */
  public thickness = 1

  /** 前景色 */
  public foreColor = "rgb(0,0,0)"

  /** 背景色 */
  public backgroundColor = "rgb(255,255,255)"

  /** 前景色透明度 */
  public foreAlpha = 1

  /** 背景色透明度 */
  public backAlpha = 1

  /** QR コードシンボルのサイズ */
  protected size = 0

  /** QR コードシンボルのサイズ(px) */
  protected sizeInPx = 0

  /** 列数 */
  public columns = 1

  /** 行数 */
  public rows = 1

  /** 左位置 */
  public left: number[] = []

  /** 上位置 */
  public top: number[] = []

  /**
   * @param canvas 出力先の <canvas> 要素
   * @param options 設定
   */
  constructor(
    protected canvas: HTMLCanvasElement,
    protected options: CanvasOptions
  ) {
    super()
    if (!isCanvasOptions(options)) {
      throw new Error("options の指定に誤りがあります。型を確認してください。")
    }
    this.thickness = defaultValue(options.thickness, this.thickness)
    this.foreColor = defaultValue(options.color, this.foreColor)
    this.backgroundColor = defaultValue(
      options.backgroundColor,
      this.backgroundColor
    )

    this.space = 4 * this.thickness

    const ctx = canvas.getContext("2d")
    if (ctx === null) {
      throw new Error("2D レンダリングがサポートされていません")
    }
    this.ctx = ctx
  }

  subscribe(emitter: EventEmitter): void {
    if (this.options.debug === true) {
      emitter.on("preDrawDetectionPattern", () => {
        this.foreColor = "rgb(200,200,200)"
      })
      emitter.on("preDrawTimingPattern", () => {
        this.foreColor = "rgb(200,200,200)"
      })
      emitter.on("preDrawAlignmentPattern", () => {
        this.foreColor = "rgb(200,200,200)"
      })
      emitter.on("preDrawData", () => {
        this.foreColor = "rgb(0,0,255)"
      })
      emitter.on("preDrawFormatInfo", () => {
        this.foreColor = "rgb(255,0,0)"
      })
      emitter.on("preDrawTypeInfo", () => {
        this.foreColor = "rgb(0,255,0)"
      })
    }
  }

  /**
   * @inheritdoc
   */
  initialize(qr: QRStruct): void {
    this.size = getSize(qr.type)
    this.sizeInPx = this.size * this.thickness + this.space * 2
    this.columns = Math.ceil(Math.sqrt(qr.division))
    this.rows = Math.ceil(qr.division / this.columns)
    this.backAlpha = this.options.transparent === true ? 0 : 1
    this.clear()
    this.resizeCanvas()
    this.fillBackground()

    for (let index = 0; index < qr.division; index++) {
      this.left[index] = (index % this.columns) * this.sizeInPx
      this.top[index] = Math.floor(index / this.columns) * this.sizeInPx
    }
  }

  begin(index: number): void {
    this.ctx.globalAlpha = this.backAlpha
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(
      this.left[index],
      this.top[index],
      this.sizeInPx,
      this.sizeInPx
    )
  }

  resizeCanvas(): void {
    if (this.options.autoResize === false) {
      return
    }
    this.canvas.width = this.sizeInPx * this.columns
    this.canvas.height = this.sizeInPx * this.rows
  }

  /**
   * 背景を塗りつぶします。
   */
  fillBackground(): void {
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.globalAlpha = this.backAlpha
    this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
  }

  /**
   * @inheritdoc
   */
  fillRect(index: number, x: number, y: number, w: number, h: number): void {
    if (this.options.flipHorizontal) {
      x = this.size - x - w
    }

    x *= this.thickness
    y *= this.thickness
    w *= this.thickness
    h *= this.thickness

    this.ctx.fillStyle = this.foreColor
    this.ctx.globalAlpha = this.foreAlpha
    this.ctx.fillRect(
      this.left[index] + this.space + x,
      this.top[index] + this.space + y,
      w,
      h
    )
  }

  /**
   * @inheritdoc
   */
  rect(index: number, x: number, y: number, w: number, h: number): void {
    for (let offset = 0; offset < w; offset++) {
      this.dot(index, x + offset, y)
      this.dot(index, x + offset, y + h - 1)
    }
    for (let offset = 1; offset < h - 1; offset++) {
      this.dot(index, x + w - 1, y + offset)
      this.dot(index, x, y + offset)
    }
  }

  /**
   * @inheritdoc
   */
  dot(index: number, x: number, y: number): void {
    if (this.options.flipHorizontal) {
      x = this.size - x - 1
    }

    x *= this.thickness
    y *= this.thickness
    this.ctx.fillStyle = this.foreColor
    this.ctx.globalAlpha = this.foreAlpha
    this.ctx.fillRect(
      this.left[index] + this.space + x,
      this.top[index] + this.space + y,
      this.thickness,
      this.thickness
    )
  }

  /**
   * canvas の内容をクリアします。
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
  }

  /**
   * Data URI Scheme に変換します。
   * @param type 画像フォーマット
   * @param quality
   */
  toDataUri(type = "image/png", quality?: unknown): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const cb = (blob: Blob | null) => {
        if (blob === null) {
          reject()
          return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
          resolve(fileReader.result as string | null)
        }
        fileReader.readAsDataURL(blob)
      }
      this.canvas.toBlob(cb, type, quality)
    })
  }
}

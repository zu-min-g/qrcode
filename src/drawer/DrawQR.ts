import { Binary, DataModule, getSize, Module } from "../core/QR"
import { alignmentPoints } from "../data"
import { EventEmitter } from "events"
import { Drawer } from "./Drawer"
import { QRData } from "../core/QRStruct"
import maskFunctions from "../core/maskFunctions"
import { Mask } from "../core/QROptions"
import { DrawingDriver } from "./DrawingDriver"

/**
 * QR コードを描画するクラス。
 */
export class DrawQR implements DrawingDriver {
  protected emitter = new EventEmitter()
  protected qr = {} as QRData

  constructor(protected drawer: Drawer) {
    this.drawer.subscribe(this.emitter)
  }

  /**
   * すべてのシンボルを描画します。
   */
  draw(qr: QRData): void {
    this.qr = qr
    this.drawer.initialize(qr)
    for (let n = 0; this.qr.codes.length > n; n++) {
      this.drawSymbol(n)
    }
  }

  /**
   * シンボル１つを描画します。
   * @param index 構造的連接の 0 から始まる位置
   */
  drawSymbol(index: number): void {
    this.emitter.emit("preDraw", { index })
    this.drawer.begin(index)
    this.drawTimingPattern(index)
    this.drawDetectionPatternAll(index)
    this.drawAlignmentPatternAll(index)
    this.drawData(index, this.qr.codes[index], this.qr.masks[index])
    this.drawFormatInfo(index, this.qr.formatInfo[index])
    this.drawTypeInfo(index, this.qr.typeInfo)
    this.drawer.end(index)
    this.emitter.emit("postDraw", { index })
  }

  /**
   * 位置検出パターンを描画します。
   * @param index 構造的連接の 0 から始まる位置
   */
  drawDetectionPatternAll(index: number): void {
    this.emitter.emit("preDrawDetectionPattern", { index })
    this.drawer.drawDetectionPattern(index, 0, 0)
    this.drawer.drawDetectionPattern(index, this.rightPosition(7), 0)
    this.drawer.drawDetectionPattern(index, 0, this.bottomPosition(7))
    this.emitter.emit("postDrawDetectionPattern", { index })
  }

  /**
   * タイミングパターンを描画します。
   * @param index 構造的連接の 0 から始まる位置
   */
  drawTimingPattern(index: number): void {
    this.emitter.emit("preDrawTimingPattern", { index })
    const len = 1 + this.qr.type * 2
    for (let i = 0; i < len; i++) {
      const posX = 8 + i * 2
      this.drawer.drawModule(index, posX, 6)
      this.drawer.drawModule(index, 6, posX)
    }
    this.emitter.emit("postDrawTimingPattern", { index })
  }

  /**
   * 位置合わせパターンを描画します。
   * @param index 構造的連接の 0 から始まる位置
   */
  drawAlignmentPatternAll(index: number): void {
    this.emitter.emit("preDrawAlignmentPattern", { index })
    if (this.qr.type === 1) {
      return
    }
    const l = alignmentPoints[this.qr.type].length
    for (let i = 0; i < l; i++) {
      for (let j = 0; j < l; j++) {
        if (
          (i == 0 && j == 0) ||
          (i == 0 && j == l - 1) ||
          (i == l - 1 && j == 0)
        )
          continue
        const x = alignmentPoints[this.qr.type][i] - 2
        const y = alignmentPoints[this.qr.type][j] - 2
        this.drawer.drawAlignmentPattern(index, x, y)
      }
    }
    this.emitter.emit("postDrawAlignmentPattern", { index })
  }

  /**
   * データ部を描画します
   * @param index 構造的連接の 0 から始まる位置
   * @param bits データ部
   * @param maskNo マスク種類
   */
  drawData(index: number, bits: DataModule[][], maskNo: Mask): void {
    this.emitter.emit("preDrawData", { index, bits })
    const mask = maskFunctions[maskNo]

    bits.forEach((col, x) => {
      col.forEach((cell, y) => {
        let isPositive = cell === Module.Positive
        if (mask(x, y)) {
          isPositive = !isPositive
        }
        if (isPositive) this.drawer.drawModule(index, x, y)
      })
    })
    this.emitter.emit("postDrawData", { index, bits })
  }

  /**
   * 形式情報を描画します
   * @param index 構造的連接の 0 から始まる位置
   * @param formatInfo 形式情報
   */
  drawFormatInfo(index: number, formatInfo: Binary): void {
    this.emitter.emit("preDrawFormatInfo", { index, formatInfo })
    // 暗モジュール
    this.drawer.drawModule(index, 8, this.bottomPosition(8))

    const yb = 17 + this.qr.type * 4 - 7
    let x1 = 8
    let y1 = 0
    let x2 = yb + 6
    let y2 = 8
    for (let i = 0; i < 15; i++) {
      if ((formatInfo & 1) === 1) {
        this.drawer.drawModule(index, x1, y1)
        this.drawer.drawModule(index, x2, y2)
      }
      formatInfo = formatInfo >> 1
      do {
        if (y1 == 8) x1--
        else y1++
      } while (x1 == 6 || y1 == 6)
      if (x2 == yb) {
        y2 = yb - 1
        x2 = 8
      } else if (x2 > yb) x2--
      else y2++
    }
    this.emitter.emit("postDrawFormatInfo", { index, formatInfo })
  }

  /**
   * 型番情報を描画します。
   * @param index 構造的連接の 0 から始まる位置
   * @param typeInfo 型番情報
   */
  drawTypeInfo(index: number, typeInfo: Binary): void {
    this.emitter.emit("preDrawTypeInfo", { index, typeInfo })
    // 型番7以上のみ出力する情報
    if (this.qr.type < 7) {
      return
    }
    for (let i = 0; i <= 5; i++) {
      for (
        let j = 17 + this.qr.type * 4 - 11;
        j <= 17 + this.qr.type * 4 - 9;
        j++
      ) {
        if ((typeInfo & 1) === 1) {
          this.drawer.drawModule(index, i, j)
          this.drawer.drawModule(index, j, i)
        }
        typeInfo = typeInfo >> 1
      }
    }
    this.emitter.emit("postDrawTypeInfo", { index, typeInfo })
  }

  /**
   * 右からの位置を返却します。
   * @param qr
   * @param x
   */
  rightPosition(x: number): number {
    const size = getSize(this.qr.type)
    return size - x
  }

  /**
   * 下からの位置を返却します。
   * @param qr
   * @param y
   */
  bottomPosition(y: number): number {
    const size = getSize(this.qr.type)
    return size - y
  }
}

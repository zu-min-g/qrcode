import { Drawer } from "./Drawer"
import { getSize } from "../core/QR"
import { EventEmitter } from "events"
import { QRStruct } from "../core/QRStruct"

const SAME_MODULE_PATTERN = /1{5,}|2{5,}/g

/**
 * 位置検出パターンと同じパターンを検出する。
 * 後読みは遅いので使用しない。
 * 先読みを使っているので明パターンx4 部分が重なっても検知できる。
 */
const DETECTION_PATTERN = /(((^|1{4})2122212)|(2122212((?=1{4})|$)))/gm

/**
 * メモリ上（配列）に描画します。
 */
export class MemoryDrawer implements Drawer {
  /** 暗ブロックの値 */
  public fore = true
  /**
   * QR コード。
   * data[index][x][y] とした場合、
   * * index: 連接 QR の 0 から始まる番号。分割しない場合は 0 のみ。
   * * x: 横方向の座標。0 開始。
   * * y: 縦方向の座標。0 開始。
   */
  public data: boolean[][][] = []

  /** QR コードシンボルのサイズ */
  protected size = 0

  initialize(emitter: EventEmitter, qr: QRStruct): void {
    this.recycle(qr)
  }

  recycle(qr: QRStruct): void {
    const newSize = getSize(qr.type)

    // サイズが変わらない場合は、配列を再利用する
    if (newSize !== this.size || this.data.length !== qr.division) {
      this.data = []
      for (let index = 0; index < qr.division; index++) {
        this.data[index] = []
        for (let x = 0; x < newSize; x++) {
          this.data[index][x] = []
        }
      }
    }

    // 配列の値をクリア
    this.size = newSize
    for (let index = 0; index < qr.division; index++) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          this.data[index][x][y] = false
        }
      }
    }
  }

  /**
   * @inheritdoc
   */
  fillRect(index: number, x: number, y: number, w: number, h: number): void {
    x = this.normalize(x)
    y = this.normalize(y)

    for (let xOffset = 0; xOffset < w; xOffset++) {
      for (let yOffset = 0; yOffset < h; yOffset++) {
        this.data[index][x + xOffset][y + yOffset] = this.fore
      }
    }
  }

  /**
   * @inheritdoc
   */
  rect(index: number, x: number, y: number, w: number, h: number): void {
    x = this.normalize(x)
    y = this.normalize(y)

    for (let offset = 0; offset < w; offset++) {
      this.data[index][x + offset][y] = this.fore
      this.data[index][x + offset][y + h - 1] = this.fore
    }
    for (let offset = 1; offset < h - 1; offset++) {
      this.data[index][x][y + offset] = this.fore
      this.data[index][x + w - 1][y + offset] = this.fore
    }
  }

  /**
   * @inheritdoc
   */
  dot(index: number, x: number, y: number): void {
    this.data[index][x][y] = this.fore
  }

  normalize(x: number): number {
    return x < 0 ? this.size + x : x
  }

  /**
   * マスク種類を決定する際に使用する得点（ペナルティ）を計算します。
   * @param index 連接 QR の位置
   */
  calcPenalty(index: number): number {
    const data = this.data[index]
    let countPositive = 0
    /** 水平方向の断面図と、垂直方向の断面図を層ごとに改行区切りで連結 */
    let str = ""
    const rows: string[] = []
    for (let x = 0; x < this.size; x++) {
      const col = data[x]
      for (let y = 0; y < this.size; y++) {
        if (x === 0) rows[y] = ""
        const cell = col[y]
        const c = cell ? "2" : "1"
        str += c
        rows[y] += c
        if (cell) countPositive++
      }
      str += "\n"
    }

    let score = 0
    str += rows.join("\n")

    // 同色の行／列の隣接モジュール
    SAME_MODULE_PATTERN.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = SAME_MODULE_PATTERN.exec(str)) !== null) {
      score += match[0].length - 2
    }

    // 同色のモジュールブロック
    for (let x = 0; x < this.size - 1; x++) {
      for (let y = 0; y < this.size - 1; y++) {
        if (
          data[x][y] === data[x + 1][y] &&
          data[x][y] === data[x][y + 1] &&
          data[x][y] === data[x + 1][y + 1]
        ) {
          score += 3
        }
      }
    }

    // 行／列における1:1:3:1:1(暗:明:暗:明:暗)のパターン
    // ここはモジュールではなくパターンという文言が使用されているため、クワイエットゾーンも考慮する
    DETECTION_PATTERN.lastIndex = 0
    while (DETECTION_PATTERN.exec(str) !== null) {
      score += 40
    }

    // 全体に占める暗モジュールの割合
    const per = Math.abs(countPositive / (this.size * this.size) - 0.5)
    score += per > 0.05 ? Math.floor(per * 20) * 10 : 0

    return score
  }
}

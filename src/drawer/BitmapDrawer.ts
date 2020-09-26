import { EventEmitter } from "events"
import { QRStruct } from "../core/QRStruct"
import { Drawer } from "."

/**
 * QR コードを描画する際のインターフェース。
 */
export abstract class BitmapDrawer implements Drawer {
  /**
   * @inheritdoc
   */
  abstract subscribe(emitter: EventEmitter): void

  /**
   * @inheritdoc
   */
  abstract initialize(qr: QRStruct): void

  /**
   * @inheritdoc
   */
  abstract begin(index: number): void

  /**
   * 矩形を描画します（塗りつぶし）
   * @param index シンボルの番号
   * @param x 左からの位置。マイナスの場合は右からの位置
   * @param y 上からの位置。マイナスの場合は下からの位置
   * @param w 幅
   * @param h 高さ
   */
  abstract fillRect(
    index: number,
    x: number,
    y: number,
    w: number,
    h: number
  ): void

  /**
   * 矩形を描画します（枠）
   * @param index シンボルの番号
   * @param x 左からの位置。マイナスの場合は右からの位置
   * @param y 上からの位置。マイナスの場合は下からの位置
   * @param w 幅
   * @param h 高さ
   */
  abstract rect(index: number, x: number, y: number, w: number, h: number): void

  /**
   * @inheritdoc
   */
  drawAlignmentPattern(index: number, x: number, y: number): void {
    // 外枠
    this.rect(index, x, y, 5, 5)

    // 中心
    this.fillRect(index, x + 2, y + 2, 1, 1)
  }

  /**
   * @inheritdoc
   */
  drawDetectionPattern(index: number, x: number, y: number): void {
    // 外枠
    this.rect(index, x, y, 7, 7)

    // 中心
    this.fillRect(index, x + 2, y + 2, 3, 3)
  }

  /**
   * @inheritdoc
   */
  drawModule(index: number, x: number, y: number): void {
    this.fillRect(index, x, y, 1, 1)
  }

  /**
   * @inheritdoc
   */
  end(): void {
    // 何もしない
  }
}

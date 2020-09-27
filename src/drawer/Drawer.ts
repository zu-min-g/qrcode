import { EventEmitter } from "events"
import { QRData } from "../core/QRStruct"

export interface Drawer {
  /**
   * 初期化します。
   * @param qr
   */
  subscribe(emitter: EventEmitter): void

  /**
   * QR コードの作成を開始します。
   * @param qr
   */
  initialize(qr: QRData): void

  /**
   * シンボルの作成を開始します。
   * @param index シンボルの番号
   */
  begin(index: number): void

  /**
   * シンボルの作成を終了します。
   * @param index シンボルの番号
   */
  end(index: number): void

  /**
   * モジュールを描画します
   * @param index シンボルの番号
   * @param x 左からの位置。0 以上を指定
   * @param y 上からの位置。0 以上を指定
   */
  drawModule(index: number, x: number, y: number): void

  /**
   * 位置合わせパターン単体を描画します。
   * @param index 構造的連接の 0 から始まる位置
   * @param x 左上の位置
   * @param y 左上の位置
   */
  drawAlignmentPattern(index: number, x: number, y: number): void

  /**
   * 位置検出パターンを描画します。
   * @param index 構造的連接の 0 から始まる位置
   * @param x 左上の位置
   * @param y 左上の位置
   */
  drawDetectionPattern(index: number, x: number, y: number): void
}

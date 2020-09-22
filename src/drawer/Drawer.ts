import { EventEmitter } from "events"
import { QRStruct } from "../core/QRStruct"

/**
 * QR コードを描画する際のインターフェース。
 */
export interface Drawer {
  /**
   * インスタンス作成後の初期化処理を行います。
   */
  initialize: (emitter: EventEmitter, qr: QRStruct) => void

  /**
   * 初期化して再度オブジェクトを利用可能な状態にします。
   */
  recycle: (qr: QRStruct) => void

  /**
   * 矩形を描画します（塗りつぶし）
   * @param index シンボルの番号
   * @param x 左からの位置。マイナスの場合は右からの位置
   * @param y 上からの位置。マイナスの場合は下からの位置
   * @param w 幅
   * @param h 高さ
   */
  fillRect: (index: number, x: number, y: number, w: number, h: number) => void

  /**
   * 矩形を描画します（枠）
   * @param index シンボルの番号
   * @param x 左からの位置。マイナスの場合は右からの位置
   * @param y 上からの位置。マイナスの場合は下からの位置
   * @param w 幅
   * @param h 高さ
   */
  rect: (index: number, x: number, y: number, w: number, h: number) => void

  /**
   * モジュールを描画します
   * @param index シンボルの番号
   * @param x 左からの位置。0 以上を指定
   * @param y 上からの位置。0 以上を指定
   */
  dot: (index: number, x: number, y: number) => void
}

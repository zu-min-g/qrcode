import { QRData } from "../core/QRStruct"

export interface DrawingDriver {
  /**
   * QR コードを描画します。
   * @param qr
   */
  draw(qr: QRData): void
}

export function isDrawingDriver(obj: unknown): obj is DrawingDriver {
  if (typeof obj !== "object") return false
  if (typeof (obj as DrawingDriver).draw !== "function") return false
  return true
}

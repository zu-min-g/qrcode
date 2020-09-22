import { QRStruct } from "../core/QRStruct"
import { ByteArrayBuilder } from "../"
import { EccLevel } from "../core/QROptions"

/**
 * QRコードのデータ部を生成するエンコーダー。
 *
 * initialize, predictDataSize, try, calcParityData の順で呼ばれます。
 * try で失敗した場合は型番を１つ大きくし、もう一度 try が呼び出されます。
 * 成功するか、型番の最大まで繰り返し呼び出されます。
 */
export interface Encoder {
  /**
   * 初期化します。
   * @param level 誤り訂正レベル
   * @param data エンコード対象
   * @param firstType 最初に施行する型番
   */
  initialize(level: EccLevel, data: string, firstType: number): void

  /**
   * データのおおよその長さを計算します。少なめに見積もります。
   *
   * @returns おおよその bit 数
   */
  predictDataSize(): number

  /**
   * 指定した型番と分割数でデータを変換します。入りきらない場合は失敗します。
   * @param struct 結果
   */
  try(struct: QRStruct): EncodeResult

  /**
   * パリティデータを生成します。
   *
   * データ全体をバイトごとに XOR 演算する。
   * ECI モードでは，データの暗号化又は圧縮後に得られる 8 ビットバイト値を計算に使用する。
   * 途中に数字、アルファベットモードで符号化する場合も、全体を ECI モードで符号化したものを計算に使用する。
   * アプリによっては読み取ったデータとパリティデータを検証するので正確な値が必要。
   *
   * @return パリティデータ
   */
  getParityData(): number
}

export function isEncoder(obj: unknown): obj is Encoder {
  if (typeof obj !== "object") return false
  if (typeof (obj as Encoder).initialize !== "function") return false
  if (typeof (obj as Encoder).predictDataSize !== "function") return false
  if (typeof (obj as Encoder).try !== "function") return false
  if (typeof (obj as Encoder).getParityData !== "function") return false
  return true
}

export interface EncodeResult {
  /** データが入りきらなかった場合 false */
  success: boolean

  /** エンコード結果 */
  data: ByteArrayBuilder[]

  /** 分割数 */
  division: number
}

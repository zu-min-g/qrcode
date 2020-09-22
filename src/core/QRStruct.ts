import { Binary, DataModule } from "./QR"
import { EccLevel, Mask } from "./QROptions"
import * as Arr from "./Arr"

/**
 * QR コードの構造
 */
export interface QRStruct {
  /** 型番 */
  type: number

  /** 分割数 */
  division: number
}

/**
 * QRStruct をコピーします
 * @param original
 */
export function copyQRStruct(original: QRStruct): QRStruct {
  const copy: QRStruct = {
    type: original.type,
    division: original.division,
  }
  return copy
}

/**
 * QR コードの構造とデータ
 */
export interface QRData extends QRStruct {
  /** 誤り訂正レベル */
  level: EccLevel

  /** フォーマット情報 */
  formatInfo: Binary[]

  /** マスク種類 */
  masks: Mask[]

  /** データ部 */
  codes: DataModule[][][]

  /** 型番情報 */
  typeInfo: Binary
}

/**
 * QRData をコピーします
 * @param original
 * @param deep
 */
export function copyQRData(original: QRData, deep = true): QRData {
  const copy: QRData = Object.assign(copyQRStruct(original), {
    level: original.level,
    formatInfo: original.formatInfo,
    masks: original.masks,
    codes: original.codes,
    typeInfo: original.typeInfo,
  })

  if (deep) {
    copy.formatInfo = copy.formatInfo.concat()
    copy.masks = copy.masks.concat()
    copy.codes = Arr.copy(copy.codes)
  }
  return copy
}

/**
 * QR コードを JSON に変換します。
 * @param data
 */
export function serializeQrData(data: QRData): string {
  return JSON.stringify(copyQRData(data))
}

/**
 * QR コードを JSON から復元します。
 * @param json
 */
export function deserializeQrData(json: string): QRData {
  const data = JSON.parse(json) as QRData
  data.codes = Arr.deleteEmpty(data.codes)
  return data
}

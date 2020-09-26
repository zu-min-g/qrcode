import {
  DrawQR,
  Drawer,
  CanvasDrawer,
  CanvasOptions,
  MemoryDrawer,
  DrawingDriver,
  isDrawingDriver,
} from "../drawer"
import { maxDataLen, rsBlock, formatInfo, typeInfo } from "../data"
import { QROptions, EccLevel, isQROptions, Mask } from "./QROptions"
import { BasicEncoder, Uni2Sjis } from "../encoder"
import { ModeSpecifier } from "./ModeSpecifier"
import { createEncoder } from "../encoder/EncoderOptions"
import { Encoder } from "../encoder/Encoder"
import { defaultValue, restrictRange } from "./Validator"
import maskFunctions from "./maskFunctions"
import { copyQRStruct, copyQRData, QRData, QRStruct } from "./QRStruct"
import { calcErrorCorrectionCodeAll } from "./calcErrorCorrectionCode"
import createRsBlocks from "./createRsBlocks"
import { generateDataModule } from "./DataModuleGenerator"
import { ByteArrayBuilder } from "./ByteArrayBuilder"
import { capacities } from "../data/capacities"
import * as Str from "./Str"
import { SvgDrawer, SvgOptions } from "../drawer/SvgDrawer"

/** 分割の最小値 */
export const DIVISION_MIN = 1
/** 分割の最大値 */
export const DIVISION_MAX = 16

/** 型番の最小値 */
export const TYPE_MIN = 1
/** 型番の最大値 */
export const TYPE_MAX = 40

export enum Module {
  /** 暗モジュール */
  Positive = 2,

  /** 明モジュール */
  Negative = 1,
}

/**
 * データ部のモジュール。
 *
 * データ部ではない場合、 undefined になる。
 */
export type DataModule = Module

/**
 * QR コードを生成します。
 * @param data 文字列
 * @param options QRコード生成設定
 */
export function generate(data: string, options: QROptions): QR {
  const qr = new QR(data, options)
  qr.generate()
  return qr
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const DEBUG_DISABLED = function (): void {}

/** QR コード一辺の長さ（ドット数・モジュール数）を算出します */
export function getSize(type: number): number {
  return 17 + type * 4
}

/** 桁数可変のバイナリ */
export type Binary = number

/** 8ビットバイト（0 ～ 255） */
export type Byte = number

/** 1ビット */
export type Bit = 0 | 1

export class QR implements QRData {
  public type = 1
  public level: EccLevel = EccLevel.L
  public division = 1
  public formatInfo: Binary[] = []
  public masks: Mask[] = []
  public codes: DataModule[][][] = []
  public typeInfo: Binary = 0

  /** マスク番号 */
  protected maskNo: Mask | undefined

  /** 8 ビットバイトデータに変換するエンコーダー */
  public encoder: Encoder

  /** デバッグ用出力関数 */
  protected debugOut: (log: unknown) => void = DEBUG_DISABLED

  public get debug(): boolean {
    return this.debugOut !== DEBUG_DISABLED
  }

  /**
   * 新しい QR コードを生成します。
   * @param data 文字列
   * @param options QRコード生成設定
   */
  constructor(protected data: string, options: QROptions) {
    if (!isQROptions(options)) {
      throw new Error("options の指定に誤りがあります。型を確認してください。")
    }
    // オプション指定がない場合はデフォルト値を使用
    this.type = restrictRange(
      defaultValue(options.type, this.type),
      TYPE_MIN,
      TYPE_MAX
    )
    this.level = defaultValue(options.level, this.level)
    this.division = restrictRange(
      defaultValue(options.division, this.division),
      DIVISION_MIN,
      DIVISION_MAX
    )
    this.encoder = createEncoder(
      typeof options.encoder === "undefined"
        ? new BasicEncoder(new Uni2Sjis(), false)
        : options.encoder
    )

    this.maskNo = options.mask

    if (options.debug === true) {
      this.debugOut = (obj) => {
        console.log(obj)
      }
    }

    if (typeof data !== "string" || data.length === 0) {
      throw new Error("data は空ではない文字列を指定してください")
    }
  }

  public generate(): void {
    this.encoder.initialize(this.level, this.data, this.type)

    /** 推測データサイズ */
    const dataSize = this.encoder.predictDataSize()

    const data = this.fixDivisionAndType(dataSize)
    this.debugOut(data)

    /* QRコードを分割する個数分、繰り返す */
    this.codes = []
    this.formatInfo = []
    this.masks = []
    const parityInfo = this.calcParityData()
    for (let n = 0; this.division > n; n++) {
      this.setSymbolLineSpecifier(data[n], n, parityInfo)

      this.padding(data[n])

      const bit = data[n].toByteArray()

      /** RS Block データ部 */
      const rsBlocks = createRsBlocks(bit, rsBlock[this.level][this.type - 1])

      /** RS Block 誤り訂正コード */
      const rsBlockECC = calcErrorCorrectionCodeAll(rsBlocks, this)

      /* 並び替え */
      const blocks = new Uint8ClampedArray(capacities[this.type].capacity)
      this.serializeRsBlock(blocks, rsBlocks)
      this.serializeErrorCorrectionCode(
        blocks,
        rsBlockECC,
        maxDataLen[this.level][this.type - 1] / 8
      )

      /* 配列へ */
      const bits = generateDataModule(blocks, this)
      this.codes.push(bits)

      /* マスク */
      const maskNo = this.mask(bits)
      this.masks.push(maskNo)

      // 形式情報を追加
      const fi = formatInfo[this.level][maskNo]
      this.formatInfo.push(fi)
      this.debugBinary(
        "level: " + EccLevel[this.level] + ", mask: " + maskNo,
        fi,
        15
      )
    }
  }

  /**
   * データの最適化・型番の選択と分割の決定
   */
  protected fixDivisionAndType(dataSize: number): ByteArrayBuilder[] {
    for (this.type; this.type <= TYPE_MAX; this.type++) {
      // 概算のデータ長と型番の最大長を比較する
      if (maxDataLen[this.level][this.type] * this.division < dataSize) {
        continue
      }

      const ret = this.encoder.try({ type: this.type, division: this.division })
      if (ret.success) {
        this.setDivision(ret.division)
        this.setType(this.type)
        return ret.data
      }
    }

    throw new Error("データが大きすぎます。")
  }

  /**
   * パリティデータを計算します。
   */
  protected calcParityData(): number {
    const parity = this.encoder.getParityData()
    return parity
  }

  /**
   * シンボル列指示子
   */
  protected setSymbolLineSpecifier(
    ba: ByteArrayBuilder,
    index: number,
    parityInfo: number
  ): void {
    if (this.division === 1) {
      return
    }

    ba.setBinary(ModeSpecifier.Connection, 4, 0)
    ba.setBinary(index, 4, 4)
    ba.setBinary(this.division - 1, 4, 8)
    ba.setBinary(parityInfo, 8, 12)

    this.debugOut("division " + (index + 1) + " of " + this.division)

    return
  }

  /**
   * QRコードの最大長に達するまで埋め草コード語で埋める。
   */
  protected padding(ba: ByteArrayBuilder): void {
    if (ba.bitLength > maxDataLen[this.level][this.type - 1]) {
      this.debugOut({
        len: ba.bitLength,
        max: maxDataLen[this.level][this.type - 1],
      })
      throw new Error("データが最大長を超えています")
    }

    // 後ろ 4 bit の終端パターン 0000 は欠落してもよい
    ba.addBinary(
      ModeSpecifier.End,
      Math.min(4, maxDataLen[this.level][this.type - 1] - ba.bitLength)
    )

    ba.pad(0, 1, Math.ceil(ba.bitLength / 8) * 8)
    ba.pad(0b1110110000010001, 16, maxDataLen[this.level][this.type - 1])
  }

  /**
   * データコード語を並び替えます。
   * @param block
   */
  protected serializeRsBlock(
    out: Uint8ClampedArray,
    block: {
      [n: number]: Uint8ClampedArray
    }
  ): void {
    const rb = rsBlock[this.level][this.type - 1]
    let updated = true
    let outPos = 0
    for (let i = 0; updated; i++) {
      let rs_count = 0
      updated = false
      rb.forEach((value, key) => {
        if (i > rb[key][2]) return
        updated = true
        for (let j = 0; j < rb[key][0]; j++) {
          out[outPos] = block[rs_count][i]
          outPos++
          rs_count++
        }
      })
    }
  }

  /**
   * 誤り訂正コード語を並び替えます。
   * @param blockECC
   */
  protected serializeErrorCorrectionCode(
    out: Uint8ClampedArray,
    blockECC: {
      [n: number]: Uint8ClampedArray
    },
    outPos: number
  ): void {
    const rb = rsBlock[this.level][this.type - 1]
    let updated = true
    for (let i = 0; updated; i++) {
      let rs_count = 0
      updated = false
      rb.forEach((value, key) => {
        if (i > rb[key][1] - rb[key][2]) return
        updated = true
        for (let j = 0; j < rb[key][0]; j++) {
          out[outPos] = blockECC[rs_count][i]
          rs_count++
          outPos++
        }
      })
    }
  }

  /**
   * マスク処理を行います。
   * @param bits データ部
   */
  protected mask(bits: DataModule[][]): Mask {
    if (typeof this.maskNo !== "undefined") {
      return this.maskNo
    }
    let min_score = 0
    let mask_num: Mask = 0

    const dummyQR = Object.assign(this.getQRData(false), {
      part: 1,
      codes: [bits],
    })
    const symbol = new MemoryDrawer()
    const drawQr = new DrawQR(symbol)

    for (const i in maskFunctions) {
      // シンボルを作成する
      dummyQR.formatInfo = [formatInfo[this.level][i]]
      dummyQR.masks = [parseInt(i) as Mask]
      drawQr.draw(dummyQR)

      const score = symbol.calcPenalty(0)

      this.debugOut("mask: " + i + ", score: " + score)

      if (min_score > score || i === "0") {
        min_score = score
        mask_num = parseInt(i) as Mask
      }
    }

    return mask_num
  }

  /**
   * 型番を設定します。
   * @param type
   */
  protected setType(type: number): void {
    this.type = type

    /* 型番情報 */
    if (this.type >= 7) {
      this.typeInfo = typeInfo[this.type - 7]
    }
  }

  /**
   * 分割数を設定します。
   * @param division
   */
  protected setDivision(division: number): void {
    if (division > DIVISION_MAX) {
      throw new Error("分割数が最大を超えています")
    }

    this.division = division
  }

  /**
   * canvas タグに出力します。
   * @param canvas
   * @param options
   */
  public drawToCanvas(
    canvas: HTMLCanvasElement,
    options: CanvasOptions
  ): CanvasDrawer {
    const drawer = new CanvasDrawer(canvas, options)
    this.draw(drawer)
    return drawer
  }

  /**
   * canvas タグに出力します。
   * @param canvas
   * @param options
   */
  public drawToSvg(svg: SVGElement, options: SvgOptions): SvgOptions {
    const drawer = new SvgDrawer(svg, options)
    this.draw(drawer)
    return drawer
  }

  /**
   * 指定した drawer に QR コードを出力します。
   * @param drawer
   */
  public draw(drawer: Drawer | DrawingDriver): void {
    if (!isDrawingDriver(drawer)) {
      drawer = new DrawQR(drawer)
    }
    drawer.draw(this)
  }

  /**
   * デバッグ用にビット列を出力します
   * @param content 内容
   * @param binary ビット列
   */
  protected debugBinary(content: string, binary: number, len: number): void {
    if (!this.debug) {
      return
    }
    const binStr = Str.toBin(binary, len)
    this.debugBinStr(content, binStr)
  }

  /**
   * デバッグ用にビット列を出力します
   * @param content 内容
   * @param binary ビット列
   */
  protected debugBinStr(content: string, binStr: string): void {
    if (!this.debug) {
      return
    }
    binStr = (binStr.match(/(.{8}|.+)/g) ?? []).join(" ")
    const obj: Record<string, string> = { content, binStr }
    this.debugOut(obj)
  }

  /**
   * QR コードの構造情報を返却します。
   */
  public getQRStruct(): QRStruct {
    return copyQRStruct(this)
  }

  /**
   * QR コードの内容を返却します。
   */
  public getQRData(deep = true): QRData {
    return copyQRData(this, deep)
  }
}

/**
 * 型番によって返却する値を変えます
 * @param type 型番
 * @param n1 型番が 9以下の場合
 * @param n2 型番が 26以下の場合
 * @param n3 その他の場合
 */
export const s = (type: number, n1: number, n2: number, n3: number): number => {
  if (type < 10) {
    return n1
  } else if (type < 27) {
    return n2
  }
  return n3
}

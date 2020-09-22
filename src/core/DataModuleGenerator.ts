import { DataModule, Module, getSize } from "./QR"
import BitReader from "./BitReader"
import getProtectedArea from "./getProtectedArea"
import { QRStruct } from "./QRStruct"

export function generateDataModule(
  bit: Uint8ClampedArray,
  struct: QRStruct
): DataModule[][] {
  const dmg = new DataModuleGenerator(bit, struct)
  dmg.generate()

  return dmg.bits
}

/**
 * ビット列を行列に配置します。
 * @param bit
 */
export class DataModuleGenerator {
  protected br: BitReader
  protected _bits: DataModule[][] = []
  protected size: number

  /** データ部以外の領域 */
  protected protectedArea: boolean[][] = []
  public get bits(): DataModule[][] {
    return this._bits
  }
  constructor(protected bit: Uint8ClampedArray, protected struct: QRStruct) {
    this.br = new BitReader(bit)
    this.size = getSize(struct.type)

    // type からデータ部の領域を計算
    this.protectedArea = getProtectedArea(struct)

    this.initialize()
  }

  protected initialize(): void {
    for (let i = 0; i < this.size; i++) {
      if (i === 6) {
        continue
      }
      this._bits[i] = []
    }
  }

  public generate(): DataModule[][] {
    for (let i = 0; i < this.size / 4 - 1; i++) {
      const baseX = this.size - i * 4 - 1

      this.downToUp(baseX)
      this.upToDown(baseX)
    }

    // バグ発見用
    const r = this.br.position - this.bit.length * 8
    if (this.br.position < this.bit.length * 8) {
      throw new Error("ビット列が超過しています。")
    } else if (r !== 0 && r !== 3 && r !== 4 && r !== 7) {
      // 残余ビット3, 4, 7ビットは許容
      throw new Error("ビット列が不足しています。")
    }

    return this._bits
  }

  protected downToUp(x: number): void {
    // タイミングパターン
    if (x <= 6) {
      x -= 1
    }
    for (let y = this.size - 1; y >= 0; y--) {
      if (y === 6) {
        // タイミングパターン Y 方向はスキップ
        continue
      }
      this.dot(x, y)
      this.dot(x - 1, y)
    }
  }

  protected upToDown(x: number): void {
    x -= 2
    // タイミングパターン
    if (x <= 6) {
      x -= 1
    }
    for (let y = 0; y < this.size; y++) {
      if (y === 6) {
        // タイミングパターン Y 方向はスキップ
        continue
      }
      this.dot(x, y)
      this.dot(x - 1, y)
    }
  }

  protected dot(x: number, y: number): void {
    if (this.check(x, y)) {
      this._bits[x][y] =
        this.br.current() === 1 ? Module.Positive : Module.Negative
      this.br.next()
    }
  }

  /**
   * 指定した座標がデータ領域の場合は true を返します。
   * @param x
   * @param y
   */
  protected check(x: number, y: number, strict = false): boolean {
    if (strict) {
      if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
        throw new Error("範囲外の座標です(" + x + "," + y + ")")
      }
    }

    if (this.protectedArea[x][y]) {
      return false
    }

    return true
  }
}

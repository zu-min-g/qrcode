export default class BitReader {
  protected _position: number
  protected _bitPosition: number
  protected _bytePosition: number
  public get position(): number {
    return this._position
  }
  constructor(protected bit: Uint8ClampedArray) {
    this._position = -1
    this._bitPosition = 0
    this._bytePosition = -1
    this.next()
  }

  /**
   * 現在の位置の文字列を返します。
   * @returns 現在の位置が長さを超えている場合は空文字を返します
   */
  public current(): number {
    return (this.bit[this._bytePosition] >> this._bitPosition) & 1
  }

  public next(): void {
    if (this._bitPosition === 0) {
      this._bitPosition = 8
      this._bytePosition++
    }
    this._bitPosition--
    this._position++
  }
}

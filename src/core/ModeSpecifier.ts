/**
 * モード指示子
 */
export enum ModeSpecifier {
  /** 数値 */
  Number = 0b0001,
  /** 英数字 */
  Alphabet = 0b0010,
  /** 8ビットバイト */
  EightBit = 0b0100,
  /** 漢字 */
  Han = 0b1000,

  /** ECI */
  ECI = 0b0111,

  /** FNCI1 */
  FNCI1 = 0b0101,
  /** FNCI2 */
  FNCI2 = 0b1001,

  /** 構造的連接 */
  Connection = 0b0011,

  /** 終端 */
  End = 0b0000,

  /** 予約１ */
  Reserved1 = 0b0110,
  /** 予約２ */
  Reserved2 = 0b1010,
  /** 予約３ */
  Reserved3 = 0b1011,
  /** 予約４ */
  Reserved4 = 0b1100,
  /** 予約５ */
  Reserved5 = 0b1101,
  /** 予約６ */
  Reserved6 = 0b1110,
  /** 予約７ */
  Reserved7 = 0b1111,
}

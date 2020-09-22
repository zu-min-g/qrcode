import { ModeSpecifier } from "../core/ModeSpecifier"

/** 文字数指示子のビット数 */
export const strLenSpecLength: { [encoding: number]: number[] } = {}
strLenSpecLength[ModeSpecifier.Number] = [10, 12, 14]
strLenSpecLength[ModeSpecifier.Alphabet] = [9, 11, 13]
strLenSpecLength[ModeSpecifier.Han] = [8, 10, 12]
strLenSpecLength[ModeSpecifier.EightBit] = [8, 16, 16]

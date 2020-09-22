/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { EccLevel } from "../../../src"
import { DataModuleGenerator } from "../../../src/core/DataModuleGenerator"
import * as Str from "../../../src/core/Str"
import * as Arr from "../../../src/core/Arr"
import { rsBlock } from "../../../src/data/"
import { Module } from "../../../src/core/QR"

describe("DataModuleGenerator", () => {
  it("型番6", () => {
    const len = rsBlock[EccLevel.L][5][0][0] * rsBlock[EccLevel.L][5][0][1]
    const src = new Uint8ClampedArray(len)
    src[0] = 0b01010000
    const br = new DataModuleGenerator(src, {
      division: 1,
      type: 6,
    })

    const ret = br.generate()

    const e = undefined
    const t = Module.Positive
    const f = Module.Negative
    const expected = Arr.transform([
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,t,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,t,f],
    ], 41, 41)

    expect(Arr.deleteEmpty(ret)).toEqual(Arr.deleteEmpty(expected))
  })
  it("型番7", () => {
    const len = rsBlock[EccLevel.L][6][0][0] * rsBlock[EccLevel.L][6][0][1]
    const src = new Uint8ClampedArray(len)
    src[0] = 0b01010000
    const br = new DataModuleGenerator(src, {
      division: 1,
      type: 7,
    })

    const ret = br.generate()

    const e = undefined
    const t = Module.Positive
    const f = Module.Negative
    const expected = Arr.transform([
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [f,f,f,f,f,f,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,e,e,e,e,e,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,t,f],
      [e,e,e,e,e,e,e,e,e,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,t,f],
    ], 45, 45)

    expect(Arr.deleteEmpty(ret)).toEqual(Arr.deleteEmpty(expected))
  })

  it("範囲外の座標", () => {
    const len = rsBlock[EccLevel.L][0][0][0] * rsBlock[EccLevel.L][0][0][1]
    const src = new Uint8ClampedArray(len)
    src[0] = 0b01010000
    const br = new DataModuleGenerator(src, {
      division: 1,
      type: 1,
    })

    // @ts-ignore
    expect(br.check(0, 0, true)).toBe(false)

    // @ts-ignore
    expect(br.check(9, 0, true)).toBe(true)

    expect(() => {
      // @ts-ignore
      br.check(-1, 0, true)
    }).toThrow()

    expect(() => {
      // @ts-ignore
      br.check(0, -1, true)
    }).toThrow()

    expect(() => {
      // @ts-ignore
      br.check(21, 0, true)
    }).toThrow()

    expect(() => {
      // @ts-ignore
      br.check(0, 21, true)
    }).toThrow()
  })

  it("ビット長超過", () => {
    const len = rsBlock[EccLevel.L][0][0][0] * rsBlock[EccLevel.L][0][0][1]
    const src = new Uint8ClampedArray(len + 1)
    src[0] = 0b01010000

    const br = new DataModuleGenerator(src, {
      division: 1,
      type: 1,
    })

    expect(() => {
      br.generate()
    }).toThrow()
  })

  it("ビット長不足", () => {
    const len = rsBlock[EccLevel.L][0][0][0] * rsBlock[EccLevel.L][0][0][1]

    const src = new Uint8ClampedArray(len - 1)
    src[0] = 0b01010000
    const br = new DataModuleGenerator(src, {
      division: 1,
      type: 1,
    })

    expect(() => {
      br.generate()
    }).toThrow()
  })
})

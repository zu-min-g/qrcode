import { ByteArrayBuilder } from "../../../src/core/ByteArrayBuilder"

describe("ByteArrayBuilder", () => {
  it("最後のバイトが 8bit そろっていない場合", () => {
    const ba = new ByteArrayBuilder()
    ba.addByte(0b00000001)
    ba.addBit(1)

    expect(ba.length).toBe(2)
    expect(ba.bitLength).toBe(9)
    expect(ba.toBinStr()).toBe("000000011")
    expect(ba.toByteArray()).toStrictEqual(
      new Uint8ClampedArray([0b00000001, 0b10000000])
    )
  })

  it("空の場合", () => {
    const ba = new ByteArrayBuilder()

    expect(ba.length).toBe(0)
    expect(ba.bitLength).toBe(0)
    expect(ba.toBinStr()).toBe("")
    expect(ba.toByteArray()).toStrictEqual(new Uint8ClampedArray())
  })

  it("setBinary", () => {
    const ba = new ByteArrayBuilder()
    ba.addByte(0b11111111)
    ba.setBinary(0b0000, 4, 1)

    expect(ba.length).toBe(1)
    expect(ba.bitLength).toBe(8)
    expect(ba.toBinStr()).toBe("10000111")
    expect(ba.toByteArray()).toStrictEqual(new Uint8ClampedArray([0b10000111]))
  })
})

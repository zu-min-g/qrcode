import BitReader from "../../../src/core/BitReader"

describe("BitReader", () => {
  it("通常ケース", () => {
    const input = new Uint8ClampedArray(1)
    input[0] = 0b01000000
    const br = new BitReader(input)
    expect(br.position).toBe(0)
    expect(br.current()).toBe(0)
    expect(br.current()).toBe(0) // next を呼ぶまで次へは進まない
    br.next()
    expect(br.position).toBe(1)
    expect(br.current()).toBe(1)
    br.next()
    expect(br.position).toBe(2)
    expect(br.current()).toBe(0)
  })
})

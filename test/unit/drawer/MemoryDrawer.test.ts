import { EccLevel, generate, MemoryDrawer } from "../../../src"

describe("MemoryDrawer", () => {
  it("score 計算", () => {
    const d = new MemoryDrawer()
    generate("ooooooooooooooooooooo", {
      mask: 3,
      level: EccLevel.L,
      encoder: {
        useEci: false,
      },
    }).draw(d)
    expect(d.calcPenalty(0)).toBe(1349)
  })
})

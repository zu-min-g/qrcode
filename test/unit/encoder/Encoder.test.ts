import { BasicEncoder, isEncoder, Uni2Sjis } from "../../../src/encoder"

describe("Encoder", () => {
  it("isEncoder", () => {
    expect(isEncoder(undefined)).toBe(false)
    expect(isEncoder(new BasicEncoder(new Uni2Sjis()))).toBe(true)
    expect(
      isEncoder({
        initialize: new Function(),
        predictDataSize: new Function(),
        try: new Function(),
      })
    ).toBe(false)
    expect(
      isEncoder({
        initialize: new Function(),
        predictDataSize: new Function(),
        getParityData: new Function(),
      })
    ).toBe(false)
    expect(
      isEncoder({
        initialize: new Function(),
        try: new Function(),
        getParityData: new Function(),
      })
    ).toBe(false)
    expect(
      isEncoder({
        predictDataSize: new Function(),
        try: new Function(),
        getParityData: new Function(),
      })
    ).toBe(false)
  })
})

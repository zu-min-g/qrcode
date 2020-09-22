import * as Arr from "../../../src/core/Arr"

describe("Arr", () => {
  it("transform", () => {
    // eslint-disable-next-line prettier/prettier
    const src = [
      [1, 0],
      [],
      [1],
    ]
    delete src[1]
    const actual = Arr.transform(src, 3, 2)

    // eslint-disable-next-line prettier/prettier
    const expected = [
      [1, -1, 1],
      [0],
    ]
    delete expected[0][1]

    expect(actual).toStrictEqual(expected)
  })
})

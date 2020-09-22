interface CanvasMock {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  clearRect: jest.Mock
  fillRect: jest.Mock
  toBlob: jest.Mock
}

export function canvasMock(): CanvasMock {
  const clearRect = jest.fn()
  const fillRect = jest.fn()
  const toBlob = jest.fn()
  const contextMock = jest.fn().mockImplementation(() => {
    return {
      clearRect,
      fillRect,
    }
  })
  const context = new contextMock() as CanvasRenderingContext2D
  const canvasMock = jest.fn().mockImplementation(() => {
    return {
      getContext: () => {
        return context
      },
      toBlob,
    }
  })
  const canvas = new canvasMock() as HTMLCanvasElement
  return {
    canvas,
    context,
    clearRect,
    fillRect,
    toBlob,
  }
}

import p5js from 'p5'

type CanvasSize = { width: number; height: number }

const sizeOverrides = new WeakMap<p5js, CanvasSize>()

export const setCanvasSizeOverride = (p5: p5js, size: CanvasSize) => {
  sizeOverrides.set(p5, size)
}

export const getCanvasSize = (p5?: p5js) => {
  const override = p5 && sizeOverrides.get(p5)
  if (override) {
    return { x: 0, y: 0, ...override }
  }

  const wrapper = document.getElementById('sketch-wrapper')
  if (!wrapper) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
  }
  return wrapper.getBoundingClientRect()
}

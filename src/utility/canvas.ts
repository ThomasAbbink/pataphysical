export const getCanvasSize = () => {
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

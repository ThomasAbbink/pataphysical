export const getCanvasSize = () => {
  const wrapper = document.getElementById('sketch-wrapper')
  return wrapper.getBoundingClientRect()
}

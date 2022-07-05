export function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2)
}
export function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2)
}

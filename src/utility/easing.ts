export function easeInSine(x: number) {
  return 1 - Math.cos((x * Math.PI) / 2)
}
export function easeOutSine(x: number) {
  return Math.sin((x * Math.PI) / 2)
}

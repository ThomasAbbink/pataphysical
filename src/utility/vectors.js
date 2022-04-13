export function distanceSquared(a, b) {
  let dx = b.x - a.x
  let dy = b.y - a.y
  return dx * dx + dy * dy
}

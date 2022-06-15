import { Vector } from 'p5'

export function distanceSquared(a, b) {
  let dx = b.x - a.x
  let dy = b.y - a.y
  return dx * dx + dy * dy
}

export function lerpAngle(a, b, increment) {
  var va = Vector.fromAngle(a)
  var vb = Vector.fromAngle(b)

  return Vector.lerp(va, vb, increment).heading()
}

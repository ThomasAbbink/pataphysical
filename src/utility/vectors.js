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

// Rotate one vector (vect) around another (axis) by the specified angle.
export function rotateAround(vect, axis, angle) {
  // Make sure our axis is a unit vector
  axis = Vector.normalize(axis)

  return Vector.add(
    Vector.mult(vect, Math.cos(angle)),
    Vector.add(
      Vector.mult(Vector.cross(axis, vect), Math.sin(angle)),
      Vector.mult(
        Vector.mult(axis, Vector.dot(axis, vect)),
        1 - Math.cos(angle),
      ),
    ),
  )
}

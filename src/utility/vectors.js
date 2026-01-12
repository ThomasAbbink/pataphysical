import p5 from 'p5'

export function distanceSquared(a, b) {
  let dx = b.x - a.x
  let dy = b.y - a.y
  return dx * dx + dy * dy
}

export function lerpAngle(a, b, increment) {
  var va = p5.Vector.fromAngle(a)
  var vb = p5.Vector.fromAngle(b)

  return p5.Vector.lerp(va, vb, increment).heading()
}

// Rotate one vector (vect) around another (axis) by the specified angle.
export function rotateAround(vect, axis, angle) {
  // Make sure our axis is a unit vector
  axis = p5.Vector.normalize(axis)

  return p5.Vector.add(
    p5.Vector.mult(vect, Math.cos(angle)),
    p5.Vector.add(
      p5.Vector.mult(p5.Vector.cross(axis, vect), Math.sin(angle)),
      p5.Vector.mult(
        p5.Vector.mult(axis, p5.Vector.dot(axis, vect)),
        1 - Math.cos(angle),
      ),
    ),
  )
}

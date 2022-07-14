import { getCanvasSize } from '../../../utility/canvas'
import { destroyableMap } from '../../../utility/destroyableSet'
import { lerpAngle } from '../../../utility/vectors'
import { generateOscillatingNumber } from '../../../utility/numbers'
import vert from './shader.vert'
import frag from './shader.frag'
import { Vector } from 'p5'

const isDebugging = false
const backgroundColor = 0
const explodyGrid = (p5) => {
  const patches = []
  let target = p5.createVector(1, 1)
  let shader

  p5.preload = () => {}
  const { width, height } = getCanvasSize()

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL)
    shader = p5.createShader(vert, frag)

    createPatch({ position: p5.createVector(0, 1, -50) })

    createPatch({ position: p5.createVector(1, 0, 50) })

    target.setMag(p5.width / 2)
    p5.pixelDensity(1)
  }

  const createPatch = ({ position }) => {
    patches.push(patch(p5, { position }))
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const getTargetRotation = generateOscillatingNumber({
    min: -0.01,
    max: 0.01,
    easing: 0.1,
    restFrames: 400,
  })

  const getInnerEyeSize = generateOscillatingNumber({
    min: 0.0,
    max: 0.02,
    easing: 0.1,
    restFrames: 800,
  })

  const getTargetMag = generateOscillatingNumber({
    min: width / 8,
    max: width / 2,
    easing: 0.1,
    restFrames: 400,
  })
  const getSize = generateOscillatingNumber({
    initialValue: 0.1,
    easing: 0.001,
    min: 0.1,
    max: 0.9,
    restFrames: 100,
  })

  const getRed = generateOscillatingNumber({
    min: 0.7,
    max: 0.85,
    increment: p5.random(0.0001, 0.001),
    initialValue: 0.8,
    restFrames: 100,
  })
  const getGreen = generateOscillatingNumber({
    min: 0.7,
    max: 0.85,
    increment: p5.random(0.0001, 0.001),
    initialValue: 0.8,
    restFrames: p5.random(0, 100),
  })
  const getBlue = generateOscillatingNumber({
    min: 0.7,
    max: 0.85,
    increment: p5.random(0.0001, 0.001),
    initialValue: 0.7,
  })

  let rotation = 0

  p5.draw = () => {
    p5.noStroke()
    const mag = getTargetMag()
    target.setMag(mag)
    target.rotate(
      getTargetRotation() * p5.map(mag, width / 8, width / 2, 2, 1),
      true,
    )
    const points = []

    patches.forEach((patch) => {
      points.push(patch.update({ target, angle: rotation }))
    })

    if (isDebugging) {
      p5.background(backgroundColor)
      p5.ellipse(target.x, target.y, 10, 10)
      patches.forEach((patch) => {
        patch.draw()
      })
    }

    if (!isDebugging) {
      p5.translate(-p5.width / 2, -p5.height / 2)

      const normalized = normalizePoints(p5, points.flat())
      const inner_eye_size = getInnerEyeSize()
      shader.setUniform('resolution', [p5.width, p5.height])
      shader.setUniform('points', normalized)
      shader.setUniform('inner_eye_size', inner_eye_size)
      shader.setUniform('size', getSize())
      shader.setUniform('color', [getRed(), getGreen(), getBlue()])
      p5.shader(shader)

      p5.rect(0, 0, p5.width, p5.height)
    }
  }
}

const normalizePoints = (p5, points) => {
  return points
    .map((point) => {
      const x = p5.map(point.x, -p5.width / 2, p5.width / 2, 1.0, 0.0, true)
      const y = p5.map(point.y, -p5.height / 2, p5.height / 2, 0.0, 1.0, true)
      const z = p5.map(point.z, -1000, 1000, 0.0, 1.0, true)
      return [x, y, z]
    })
    .flat()
}

const patch = (p5, { position, patchSize = p5.width / 3 }) => {
  const flurbCount = 5

  const { items: flurbs, create } = destroyableMap()
  for (let i = 0; i < flurbCount; i++) {
    for (let j = 0; j < flurbCount; j++) {
      const x =
        position.x + (patchSize / flurbCount) * i - patchSize + patchSize / 2
      const y =
        position.y + (patchSize / flurbCount) * j - patchSize + patchSize / 2

      const vec = p5.createVector(x, y, position.z)

      create(flurb(p5, { gridPosition: vec, patchSize }))
    }
  }

  // returns an array of vectors
  const update = ({ target }) => {
    const res = []
    for (let point of flurbs.values()) {
      res.push(point.update({ target, position }))
    }

    return res
  }

  const draw = () => {
    flurbs.forEach((flurb) => {
      flurb.draw()
    })
  }

  return { draw, update }
}

const flurb =
  (p5, { gridPosition } = {}) =>
  ({ destroy, id }) => {
    let zRotation = 0
    let yRotation = 0
    let xRotation = 0
    let endPos
    let magVelocity = 0
    //returns a 3d vector with the latest position
    const update = ({ target, position: patchCenter }) => {
      let ease = 0.05
      endPos = patchCenter.copy()

      endPos.add(gridPosition)

      endPos.setMag(endPos.mag() + magVelocity)

      const targetAngle = p5.atan2(target.y - endPos.y, target.x - endPos.x)

      xRotation = lerpAngle(xRotation, targetAngle, ease)
      yRotation = lerpAngle(yRotation, targetAngle, ease * 2)
      zRotation = lerpAngle(zRotation, targetAngle, ease)

      // apply the rotation to the endpos
      endPos = rotateAround(endPos, p5.createVector(1, 0, 0), xRotation)
      endPos = rotateAround(endPos, p5.createVector(0, 1, 0), yRotation)
      endPos = rotateAround(endPos, p5.createVector(0, 0, 1), zRotation)
      return endPos
    }

    const draw = () => {
      p5.push()
      p5.translate(endPos.x, endPos.y, endPos.z)
      p5.sphere(10)
      p5.pop()
    }

    return { draw, update }
  }

// Rotate one vector (vect) around another (axis) by the specified angle.
function rotateAround(vect, axis, angle) {
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

explodyGrid.date = '2022-06-28'
export { explodyGrid }

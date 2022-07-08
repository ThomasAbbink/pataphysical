import { getCanvasSize } from '../../../utility/canvas'
import { destroyableMap } from '../../../utility/destroyableSet'
import { distanceSquared, lerpAngle } from '../../../utility/vectors'
import { easeInSine, easeOutSine } from '../../../utility/easing'
import { generateOscillatingNumber } from '../../../utility/numbers'
import vert from './shader.vert'
import frag from './shader.frag'
import { Vector } from 'p5'

const explodyGrid = (p5) => {
  const patches = []
  let target = p5.createVector(1, 1)
  let shader

  p5.preload = () => {}
  const { width, height } = getCanvasSize()

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL)
    shader = p5.createShader(vert, frag)

    createPatch({ position: p5.createVector(0, 1, -20) })

    createPatch({ position: p5.createVector(1, 0, 20) })

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

  const getTargetMag = generateOscillatingNumber({
    min: 1,
    max: width / 2,
    increment: width / 1000,
    initialValue: width * 0.9,
  })

  const getTargetRotation = generateOscillatingNumber({
    min: -0.03,
    max: 0.03,
    easing: 0.1,
    restFrames: 400,
  })

  const getInnerEyeSize = generateOscillatingNumber({
    min: 0.0,
    max: 0.02,
    easing: 0.1,
    restFrames: 400,
  })
  let rotation = 0

  p5.draw = () => {
    p5.noStroke()
    target.rotate(getTargetRotation())
    target.setMag(getTargetMag())
    const points = []

    patches.forEach((patch) => {
      points.push(patch.update({ target, angle: rotation }))
    })

    p5.translate(-p5.width / 2, -p5.height / 2)

    const normalized = normalizePoints(p5, points.flat())
    const inner_eye_size = getInnerEyeSize()
    shader.setUniform('resolution', [p5.width, p5.height])
    shader.setUniform('points', normalized)
    shader.setUniform('inner_eye_size', inner_eye_size)

    p5.shader(shader)

    p5.rect(0, 0, p5.width, p5.height)
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
    const dist = distanceSquared(position, target)
    const isScattering = dist < patchSize * patchSize
    const res = []

    for (let point of flurbs.values()) {
      res.push(point.update({ target, isScattering, position }))
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
  (p5, { gridPosition, patchSize } = {}) =>
  ({ destroy, id }) => {
    let zRotation = 0
    let yRotation = 0
    let xRotation = 0
    const gridOffset = gridPosition.copy()
    const scatterPosition = p5.createVector(
      p5.sin(gridOffset.x) * p5.TWO_PI,
      p5.sin(gridOffset.y) * p5.TWO_PI,
      p5.sin(gridOffset.z) * p5.TWO_PI,
    )
    scatterPosition.setMag(patchSize)
    const scatterSpeed = 10
    const gatherSpeed = 20
    let endPos

    //returns a 3d vector with the latest position
    const update = ({ target, position, isScattering }) => {
      // increase te magnitude to a max if the flurb is scattering
      if (isScattering && gridOffset.mag() < patchSize) {
        const velocity = easeOutSine(1 - gridOffset.mag() / patchSize)
        gridOffset.setMag(gridOffset.mag() + scatterSpeed * velocity)
      }

      // return the flurb to its original position in the grid if it is not scattering
      if (!isScattering && gridOffset.mag() > gridPosition.mag()) {
        const velocity = easeInSine(1 - gridPosition.mag() / gridOffset.mag())
        let next = gridOffset.mag() - velocity * gatherSpeed
        if (next < gridPosition.mag()) {
          next = gridPosition.mag()
        }
        gridOffset.setMag(next)
      }

      const targetAngle = p5.atan2(
        target.y - position.y - gridPosition.y,
        target.x - position.x - gridPosition.x,
      )

      let ease = isScattering ? 0.01 : 0.03
      xRotation = lerpAngle(xRotation, targetAngle, ease)

      yRotation = lerpAngle(yRotation, targetAngle, ease * 0.8)
      zRotation = lerpAngle(zRotation, targetAngle, ease)

      // apply the rotation to the endpos
      const c = position.copy()
      endPos = c.add(gridOffset)

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

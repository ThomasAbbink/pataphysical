import { getCanvasSize } from '../../../utility/canvas'
import { destroyableMap } from '../../../utility/destroyableSet'
import { lerpAngle, rotateAround } from '../../../utility/vectors'
import { generateOscillatingNumber } from '../../../utility/numbers'
import vert from './shader.vert'
import frag from './shader.frag'

const isDebugging = false
const backgroundColor = 0
const voronoiPatches = (p5) => {
  const patches = []
  let target = p5.createVector(1, 1)
  let shader

  const { width, height } = getCanvasSize()
  let smallestWindowDimension = width > height ? height : width

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL)
    shader = p5.createShader(vert, frag)

    createPatch({
      position: p5.createVector(0, 1, -smallestWindowDimension / 10),
      patchSize: smallestWindowDimension / 3,
      flurbCount: 5,
    })
    createPatch({
      position: p5.createVector(1, 0, smallestWindowDimension / 10),
      patchSize: smallestWindowDimension / 3,
      flurbCount: 5,
    })

    target.setMag(smallestWindowDimension / 2)
    p5.pixelDensity(1)
  }

  const createPatch = (options) => {
    patches.push(patch(p5, options))
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
    smallestWindowDimension = width > height ? height : width
  }

  const getTargetRotation = generateOscillatingNumber({
    min: -0.01,
    max: 0.01,
    easing: 0.1,
    restFrames: 400,
  })

  const getTargetMag = generateOscillatingNumber({
    min: smallestWindowDimension / 8,
    max: smallestWindowDimension / 2,
    easing: 0.1,
    restFrames: 400,
  })

  const getShineSize = generateOscillatingNumber({
    initialValue: 0.16,
    easing: 0.0001,
    min: 0.16,
    max: 0.5,
    restFrames: 500,
  })

  const getInnerEyeSize = generateOscillatingNumber({
    min: 0.0,
    max: 0.15,
    increment: 0.0001,
    restFrames: 200,
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
  const getBackgroundRed = generateOscillatingNumber({
    min: 0.0,
    max: 0.2,
    increment: p5.random(0.0001, 0.001),
    initialValue: 0.0,
    restFrames: 100,
  })
  const getBackgroundGreen = generateOscillatingNumber({
    min: 0.0,
    max: 0.2,
    increment: p5.random(0.0001, 0.001),
    initialValue: 0.0,
    restFrames: p5.random(0, 100),
  })
  const getBackgroundBlue = generateOscillatingNumber({
    min: 0.0,
    max: 0.2,
    increment: p5.random(0.0001, 0.001),
    initialValue: 0.0,
  })

  p5.draw = () => {
    p5.noStroke()
    const mag = getTargetMag()
    target.setMag(mag)
    target.rotate(
      getTargetRotation() *
        p5.map(
          mag,
          smallestWindowDimension / 8,
          smallestWindowDimension / 2,
          2,
          1,
        ),
      true,
    )
    const points = []

    patches.forEach((patch) => {
      points.push(patch.update({ target }))
    })

    if (isDebugging) {
      p5.background(backgroundColor)
      p5.ellipse(target.x, target.y, 10, 10)
      patches.forEach((patch) => {
        patch.draw()
      })
    }

    if (!isDebugging) {
      p5.translate(-width / 2, -height / 2)

      const normalized = normalizePoints(p5, points.flat())
      const inner_eye_size = getInnerEyeSize()
      shader.setUniform('resolution', [width, height])
      shader.setUniform('points', normalized)
      shader.setUniform('inner_eye_size', inner_eye_size)
      shader.setUniform('shine_size', getShineSize())
      shader.setUniform('color', [getRed(), getGreen(), getBlue(), 1.0])
      shader.setUniform('background_color', [
        getBackgroundRed(),
        getBackgroundGreen(),
        getBackgroundBlue(),
      ])
      p5.shader(shader)

      p5.rect(0, 0, width, height)
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

const patch = (p5, { position, patchSize = p5.width / 3, flurbCount = 5 }) => {
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
  () => {
    let zRotation = 0
    let yRotation = 0
    let xRotation = 0
    let endPos

    //returns a 3d vector with the latest position
    const update = ({ target, position: patchCenter }) => {
      let ease = 0.05
      endPos = patchCenter.copy()

      endPos.add(gridPosition)

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

voronoiPatches.date = '2022-06-28'
export { voronoiPatches }

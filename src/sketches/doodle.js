import { getCanvasSize } from '../utility/canvas'
import { destroyableSet } from '../utility/destroyableSet'
import { distanceSquared, lerpAngle } from '../utility/vectors'
import { easeInSine, easeOutSine } from '../utility/easing'
import { generateOscillatingNumber } from '../utility/numbers'
import { backgroundColor } from '../style/colors'

const doodle = (p5) => {
  const patches = []
  let target = p5.createVector(1, 1)
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height, p5.WEBGL)

    p5.background(backgroundColor)
    createPatch({ position: p5.createVector(0, 0, -100) })
    // createPatch({ position: p5.createVector(0, 0, 1) })
    createPatch({ position: p5.createVector(0, 0, 100) })

    target.setMag(p5.width / 2)
  }

  const createPatch = ({ position }) => {
    patches.push(patch(p5, { position }))
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const getTargetMag = generateOscillatingNumber({
    min: 100,
    max: 400,
    increment: 1,
    initialValue: 300,
  })

  const getTargetRotation = generateOscillatingNumber({
    min: -0.03,
    max: 0.03,
    easing: 0.1,
    restFrames: 400,
  })

  let rotation = 0
  p5.draw = () => {
    p5.background(backgroundColor)
    p5.noStroke()

    // p5.directionalLight(255, 255, 255, 0, 0, -1000)

    const mouse = p5.createVector(
      p5.mouseX - p5.width / 2,
      p5.mouseY - p5.height / 2,
      0,
    )
    p5.emissiveMaterial(210, 210, 210)
    // p5.fill(255, 0, 0)

    target.rotate(getTargetRotation())
    target.setMag(getTargetMag())
    // p5.pointLight(255, 255, 255, target.x, target.y, 300)

    patches.forEach((patch) => patch.draw({ target, angle: rotation }))
  }
}

const patch = (p5, { position }) => {
  const flurbCount = 20
  const patchSize = p5.width / 4
  const { items: flurbs, create } = destroyableSet()
  for (let i = 0; i < flurbCount; i++) {
    for (let j = 0; j < flurbCount; j++) {
      const x =
        position.x + (patchSize / flurbCount) * i - patchSize + patchSize / 2
      const y =
        position.y + (patchSize / flurbCount) * j - patchSize + patchSize / 2
      create(flurb(p5, { gridPosition: p5.createVector(x, y, 0), patchSize }))
    }
  }

  const draw = ({ target, angle }) => {
    const dist = distanceSquared(position, target)
    const isScattering = dist < patchSize * patchSize
    flurbs.forEach((flurb) => {
      flurb.draw({ target, position, isScattering })
    })
  }

  return { draw }
}

const flurb =
  (p5, { gridPosition, patchSize } = {}) =>
  ({ destroy, id }) => {
    let zRotation = 0
    let yRotation = 0
    let xRotation = 0
    let gridOffset = gridPosition.copy()
    const scatterSpeed = 10
    const draw = ({ target, position, isScattering }) => {
      if (isScattering && gridOffset.mag() < patchSize) {
        const velocity = easeOutSine(1 - gridOffset.mag() / patchSize)
        gridOffset.setMag(gridOffset.mag() + scatterSpeed * velocity)
      }

      if (!isScattering && gridOffset.mag() > gridPosition.mag()) {
        const velocity = easeInSine(1 - gridPosition.mag() / gridOffset.mag())
        let next = gridOffset.mag() - velocity * scatterSpeed
        if (next < gridPosition.mag()) {
          next = gridPosition.mag()
        }
        gridOffset.setMag(next)
      }

      const targetAngle = p5.atan2(
        target.y - position.y - gridPosition.y,
        target.x - position.x - gridPosition.x,
      )

      let ease = isScattering ? 0.01 : 0.1
      xRotation = lerpAngle(yRotation, targetAngle, ease * 0.3)
      yRotation = lerpAngle(yRotation, targetAngle, ease * 0.8)
      zRotation = lerpAngle(zRotation, targetAngle, ease)

      p5.push()

      p5.rotateY(yRotation)
      p5.rotateZ(zRotation)
      p5.rotateX(xRotation)

      const c = position.copy()
      const g = gridOffset.copy()

      let end = c.add(g)

      p5.translate(end.x, end.y, end.z)

      p5.sphere(5)

      p5.pop()
    }

    return { draw }
  }

doodle.date = '2022-06-28'
export { doodle }

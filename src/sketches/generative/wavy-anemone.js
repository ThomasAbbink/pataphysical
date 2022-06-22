import { getCanvasSize } from '../../utility/canvas'
import { P5Wrapper } from '../P5Wrapper'

import { distanceSquared } from '../../utility/vectors'
import {
  generateLoopNumber,
  generateOscillatingNumber,
} from '../../utility/numbers'
import { lerpAngle } from '../../utility/vectors'
import { destroyableSet } from '../../utility/destroyableSet'

let backgroundColor = 0

const sketch = (p5) => {
  const { items: flurbs, create } = destroyableSet()
  const flurbsPerRow = 15
  let homeTarget
  let target

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    homeTarget = p5.createVector(0, 1)
    target = p5.createVector(1, 0)
    homeTarget.setMag(p5.width / 5)
    target.setMag(p5.height / 5)
    p5.colorMode(p5.HSL)

    const widthPadding = p5.width / 2.5
    const heightPadding = p5.height / 2.5
    for (let i = 0; i < flurbsPerRow; i++) {
      for (let j = 0; j < flurbsPerRow; j++) {
        create(
          flurb({
            p5,
            position: p5.createVector(
              ((p5.width - widthPadding) / flurbsPerRow) * i -
                (p5.width - widthPadding) / 2,
              ((p5.height - heightPadding) / flurbsPerRow) * j -
                (p5.height - heightPadding) / 2,
            ),
          }),
        )
      }
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const getBaseAngle = generateOscillatingNumber({
    min: -5,
    max: 5,
    increment: 0.001,
  })

  const getBaseAngleOffSet = generateOscillatingNumber({
    min: -0.5,
    max: 0.5,
    increment: 0.005,
  })

  const getHomeRotation = generateOscillatingNumber({
    min: p5.random(-0.02, -0.01),
    max: p5.random(0.01, 0.02),
    initialValue: 0,
    increment: 0.0001,
  })

  const getTargetRotation = generateOscillatingNumber({
    min: p5.random(-0.05, -0.01),
    max: p5.random(0.01, 0.05),
    initialValue: 0,
    increment: 0.0001,
  })

  const getBackgroundHue = generateLoopNumber({
    min: 0,
    max: 360,
    increment: 0.1,
    initialValue: p5.random(0, 360),
  })

  const getBackgroundSaturation = generateOscillatingNumber({
    min: 10,
    max: 30,
    easing: 0.1,
    restFrames: 500,
    initialValue: 10,
  })

  const getBaseThickness = generateOscillatingNumber({
    min: 1,
    max: 3,
    increment: 0.01,
  })

  const getHue = generateLoopNumber({
    min: 0,
    max: 360,
    increment: 0.1,
    initialValue: 0,
  })
  let isDrifting = true
  p5.draw = () => {
    if (p5.frameCount % 500 === 0) {
      isDrifting = !isDrifting
    }
    p5.translate(p5.width / 2, p5.height / 2)

    homeTarget.rotate(getHomeRotation())
    target.rotate(getTargetRotation())

    const backgroundSat = getBackgroundSaturation()

    const baseAngle = getBaseAngle()
    const baseAngleOffset = getBaseAngleOffSet()
    const backgroundHue = getBackgroundHue()
    const backgroundRadius = p5.drawingContext.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      p5.height,
    )
    const bc1 = p5.color(backgroundHue, 0, 5)
    const bc2 = p5.color(backgroundHue, 0, 10)
    const bc3 = p5.color(backgroundHue, backgroundSat, 20)
    backgroundRadius.addColorStop(0, bc1.toString())

    backgroundRadius.addColorStop(0.5, bc2.toString())

    backgroundRadius.addColorStop(0.9, bc3.toString())
    p5.drawingContext.fillStyle = backgroundRadius
    p5.noStroke()
    p5.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height)

    const hue = getHue()

    const baseThickness = getBaseThickness()
    flurbs.forEach(({ draw }) =>
      draw({
        target,
        baseAngle: baseAngle + baseAngleOffset,
        homeTarget,
        baseThickness,
        backgroundHue,
        hue,
        isDrifting,
      }),
    )
  }
}

const flurb =
  ({ p5, position }) =>
  ({ destroy, id }) => {
    let length = 80
    let rotation = 0

    let easing = 0.02
    let lengthStep = 0.01
    const max_offset = p5.random(0, 60)
    let xOff = p5.random(0, max_offset)
    let yOff = p5.random(0, max_offset)

    const segmentCount = 4

    let segmentRotations = []

    for (let i = 0; i < segmentCount; i++) {
      segmentRotations.push(0)
    }
    const maxLength = p5.map(p5.width, 400, 1200, 80, 150)
    const minLength = maxLength / 3
    let sat = 80
    let minSat = 10
    let maxSat = 100
    const thickness = p5.random(1, 5)

    const draw = ({
      target: mouse,
      baseAngle,
      homeTarget,
      baseThickness,
      backgroundHue,
      hue,
      isDrifting = true,
    }) => {
      if (isDrifting) {
        if (xOff < max_offset) {
          xOff += 0.1
        }
        if (yOff < max_offset) {
          yOff += 0.1
        }
      }

      if (!isDrifting) {
        if (xOff > 0) {
          xOff -= 0.1
        }
        if (yOff > 0) {
          yOff -= 0.1
        }
      }
      const pOff = p5.createVector(position.x + xOff, position.y + yOff)
      const widthSquared = p5.width * p5.width

      const target =
        distanceSquared(pOff, mouse) > distanceSquared(pOff, homeTarget)
          ? homeTarget
          : mouse

      let dist = distanceSquared(pOff, target)
      const distInfluenceSize = widthSquared / 30
      if (dist > distInfluenceSize && length < maxLength) {
        length += maxLength * lengthStep
      }

      if (dist < distInfluenceSize && length > minLength) {
        length -= (maxLength * lengthStep) / 2
      }
      const targetAngle =
        p5.HALF_PI * baseAngle + p5.atan2(target.y - pOff.y, target.x - pOff.x)

      p5.push()
      p5.translate(pOff.x, pOff.y)
      const p = []

      function easeInSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2)
      }
      function easeOutSine(x) {
        return Math.sin((x * Math.PI) / 2)
      }
      // use ease in to slow the acceleration, reduce jitter

      const eis = easeInSine(
        p5.map(Math.abs(rotation - targetAngle), 0, p5.PI, 0.1, 1, true),
      )
      rotation = lerpAngle(rotation, targetAngle, easing * eis)

      for (let i = 0; i <= segmentCount; i += 1) {
        const w = i * (thickness / segmentCount) + baseThickness
        const progress = p5.map(i, 0, segmentCount, 0, 1, true)
        // segments spaced closer together at the bottom
        const h = -(length - length * easeOutSine(progress))
        // start with the top
        const v1 = p5.createVector(-w, h)
        const v2 = p5.createVector(w, h)
        // each segment rotation follows the previous one
        if (i === 0) {
          segmentRotations[i] = lerpAngle(
            segmentRotations[i],
            targetAngle,
            easing,
          )
        } else {
          segmentRotations[i] = lerpAngle(
            segmentRotations[i],
            segmentRotations[i - 1],
            easing * 5,
          )
        }
        v1.rotate(segmentRotations[i])
        v2.rotate(segmentRotations[i])

        p.push({ vector: v1, key: i })
        p.push({ vector: v2, key: segmentCount * 2 - i })
      }

      const gradient = p5.drawingContext.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        maxLength,
      )
      const isHome = target === homeTarget
      if (isHome && sat > minSat) {
        sat -= 1
      }
      if (!isHome && sat < maxSat) {
        sat += 1
      }
      const c1 = p5.color(backgroundHue, 0, 0, 0)
      let c2 = p5.color(hue, sat / 2, 50, 0.3)
      let c3 = p5.color(hue, sat, 90, 1)
      gradient.addColorStop(0, c1.toString())

      gradient.addColorStop(0.3, c2.toString())

      gradient.addColorStop(0.9, c3.toString())

      p5.drawingContext.fillStyle = gradient

      p5.noStroke()
      p.sort((a, b) => a.key - b.key)

      p5.beginShape()
      p.forEach(({ vector }) => {
        // p5.ellipse(vector.x, vector.y, 4, 4) // for debugging
        p5.curveVertex(vector.x, vector.y)
      })
      p5.endShape(p5.CLOSE)
      p5.pop()
    }
    return { draw }
  }

export default () => <P5Wrapper sketch={sketch} />

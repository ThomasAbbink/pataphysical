import React from 'react'
import { getCanvasSize } from '../../utility/canvas'
import { P5Wrapper } from '../P5Wrapper'
import { v4 as uuid } from 'uuid'
import { distanceSquared } from '../../utility/vectors'
import {
  generateLoopNumber,
  generateOscillatingNumber,
} from '../../utility/numbers'
import { lerpAngle } from '../../utility/vectors'

let backgroundColor = 0

const sketch = (p5) => {
  const { items: flurbs, create } = destroyableSet()
  const flurbsPerRow = 20
  let homeTarget
  let target
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    homeTarget = p5.createVector(0, 1)
    target = p5.createVector(1, 0)
    homeTarget.setMag(p5.width / 4)
    target.setMag(p5.height / 4)
    p5.colorMode(p5.HSL)
    const widthPadding = p5.width / 3
    const heightPadding = p5.height / 3
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

  const getHue = generateLoopNumber({
    min: 0,
    max: 360,
    increment: 0.1,
    initialValue: p5.random(0, 360),
  })

  const getBackgroundHue = generateLoopNumber({
    min: 0,
    max: 360,
    increment: 0.1,
    initialValue: p5.random(0, 360),
  })

  const getBackgroundSaturation = generateOscillatingNumber({
    min: 10,
    max: 50,
    easing: 0.1,
    restFrames: 500,
    initialValue: 10,
  })

  const getBaseThickness = generateOscillatingNumber({
    min: 1,
    max: 8,
    increment: 0.001,
  })

  p5.draw = () => {
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
    const bc1 = p5.color(backgroundHue, backgroundSat, 5)
    const bc2 = p5.color(backgroundHue, backgroundSat, 10)
    const bc3 = p5.color(backgroundHue, backgroundSat, 100)
    backgroundRadius.addColorStop(0, bc1.toString())

    backgroundRadius.addColorStop(0.3, bc2.toString())

    backgroundRadius.addColorStop(0.9, bc3.toString())
    p5.drawingContext.fillStyle = backgroundRadius
    p5.noStroke()
    p5.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height)

    const hue = getHue()
    const gradient = p5.drawingContext.createRadialGradient(0, 0, 0, 0, 0, 200)

    const c1 = p5.color(backgroundHue, backgroundSat, 5, 0)
    let c2 = p5.color(hue, backgroundSat, 30, 0.2)
    let c3 = p5.color(hue, 80, 60, 0.9)
    gradient.addColorStop(0, c1.toString())

    gradient.addColorStop(0.2, c2.toString())

    gradient.addColorStop(0.8, c3.toString())

    p5.drawingContext.fillStyle = gradient
    const baseThickness = getBaseThickness()
    p5.background(backgroundColor, 0, 0, 0.3)
    flurbs.forEach(({ draw }) =>
      draw({
        target,
        baseAngle: baseAngle + baseAngleOffset,
        homeTarget,
        baseThickness,
      }),
    )
  }
}

const flurb =
  ({ p5, position }) =>
  ({ destroy, id }) => {
    let length = 150
    let rotation = 0

    let easing = 0.02
    let lengthStep = 0.01
    const max_offset = 30
    const xOff = p5.random(-max_offset, max_offset)
    const yOff = p5.random(-max_offset, max_offset)

    const segmentCount = 3

    let segmentRotations = []

    for (let i = 0; i < segmentCount; i++) {
      segmentRotations.push(0)
    }
    const minLength = 50
    const maxLength = 150

    const draw = ({ target: mouse, baseAngle, homeTarget, baseThickness }) => {
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
      const thickness = 4
      const p = []

      function easeInSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2)
      }
      // use ease in to slow the acceleration, reduce jitter

      const eis = easeInSine(
        p5.map(Math.abs(rotation - targetAngle), 0, p5.PI, 0.1, 1, true),
      )
      rotation = lerpAngle(rotation, targetAngle, easing * eis)

      for (let i = 0; i <= segmentCount; i += 1) {
        const w = i * (thickness / segmentCount) + baseThickness
        // start with the top
        const v1 = p5.createVector(
          -w,
          0 - (length - i * (length / segmentCount)),
        )
        const v2 = p5.createVector(
          w,
          0 - (length - i * (length / segmentCount)),
        )
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

      p5.noStroke()
      // const opactity = p5.map(dist, 0, widthSquared / 8, 0, 200, true)
      p.sort((a, b) => a.key - b.key)

      p5.beginShape()
      p.forEach(({ vector }) => {
        // p5.ellipse(vector.x, vector.y, 4, 4)
        p5.curveVertex(vector.x, vector.y)
      })
      p5.endShape(p5.CLOSE)
      p5.pop()
    }
    return { draw }
  }

const destroyableSet = () => {
  const items = new Map()

  const destroy = (id) => {
    items.delete(id)
  }

  const create = (item) => {
    if (typeof item !== 'function') {
      throw new Error('item must be a function')
    }
    const id = uuid()
    items.set(id, item({ id, destroy }))
  }
  return { create, destroy, items }
}

export default () => <P5Wrapper sketch={sketch} />

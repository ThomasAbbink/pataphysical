import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { generateOscillatingNumber } from '../../../utility/numbers'
import { v4 as uuid } from 'uuid'

let backgroundColor = 255

const sketch = (p5) => {
  const tiles = new Map()
  const tileCount = 15
  let radius = 200
  p5.setup = () => {
    p5.colorMode(p5.HSB)
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    radius =
      p5.width > p5.height
        ? (p5.width * 2) / tileCount
        : (p5.height * 2) / tileCount

    setupTriangles()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    radius = (p5.width * 2) / tileCount
    p5.resizeCanvas(width, height)
  }

  const setupTriangles = () => {
    const rowCount = Math.ceil(p5.height / (radius * 2)) + 1

    for (let i = 0; i <= rowCount; i++) {
      addRow()
    }
  }

  let triangleRowCount = 0
  const triangleRow = (y) => {
    const sx = p5.sin(p5.TWO_PI / 3) * radius
    triangleRowCount++
    const hue = getHue()
    const gradientHue = getGradientHue()
    for (let i = 0; i < tileCount; i++) {
      const rotation = i % 2 === 0 ? 0 : p5.PI
      const rotationOffset = (p5.random([0, 1, 2, 3, 4]) * p5.TWO_PI) / 3

      // make each triangle align with the row
      const yOffset = rotation !== 0 ? radius / 2 : 0
      // every other row is offset by the radius
      let xOffset = triangleRowCount % 2 === 0 ? -radius + (radius - sx) : 0
      xOffset += i * -(radius - sx)
      const position = p5.createVector(i * radius + xOffset, y + yOffset)
      addTile({
        position,
        radius,
        points: 3,
        rotation: rotation + rotationOffset,
        hue,
        gradientHue,
      })
    }
  }

  const getGradientRadiusInterval = generateOscillatingNumber({
    initialValue: 1,
    min: 0,
    max: 100,
    easing: 0.005,
    restFrames: 100,
  })

  const getGradientBrightness = generateOscillatingNumber({
    initialValue: 30,
    min: 30,
    max: 60,
    increment: 0.1,
    restFrames: 100,
  })

  const onDestroyTile = (id) => {
    tiles.delete(id)
  }

  const addTile = ({ ...tileProps }) => {
    const id = uuid()
    tiles.set(
      id,
      tile(p5, {
        ...tileProps,
        id,
        onDestroy: onDestroyTile,
      }),
    )
  }

  // add a row on top of the top row
  const addRow = () => {
    const topY = Array.from(tiles.values()).reduce((acc, tile) => {
      return tile.position.y < acc ? tile.position.y : acc
    }, p5.height + radius)
    if (topY < 0 - radius) return
    triangleRow(topY - radius * 1.5)
  }

  const getHue = generateOscillatingNumber({
    initialValue: p5.random(0, 360),
    min: 0,
    max: 360,
    increment: 6,
  })

  const getGradientHue = generateOscillatingNumber({
    initialValue: p5.random(0, 360),
    min: 0,
    max: 360,
    increment: 3,
  })

  const getYVelocity = generateOscillatingNumber({
    initialValue: 1,
    min: 1,
    max: 2,
    increment: 0.01,
    restFrames: 200,
  })

  p5.draw = () => {
    p5.background(backgroundColor)
    p5.stroke(255)
    if (p5.frameCount % 30 === 0) {
      addRow()
    }
    const yVelocity = getYVelocity()
    const gradientBrightness = getGradientBrightness()
    const gradientRadiusInterval = getGradientRadiusInterval() / 100
    tiles.forEach((tile) => {
      tile.draw({ gradientRadiusInterval, yVelocity, gradientBrightness })
    })
  }
}

const tile = (
  p5,
  {
    position,
    radius = 100,
    points = 3,
    rotation,
    id,
    onDestroy,
    hue = 0,
    gradientHue,
  },
) => {
  const excluded = p5.random([0, 1, 2])

  const isOutOfBounds = () => {
    return position.y - radius > p5.height
  }

  const draw = ({
    gradientRadiusInterval,
    yVelocity = 1,
    gradientBrightness,
  }) => {
    if (isOutOfBounds()) {
      destroy()
    }

    position.y += yVelocity
    p5.push()
    p5.translate(position.x, position.y)
    p5.rotate(rotation)
    p5.strokeWeight(0)

    const gradient = p5.drawingContext.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      radius,
    )

    let c1 = p5.color(hue, 100, gradientBrightness)
    let c2 = p5.color(gradientHue, 100, 100)
    gradient.addColorStop(0, c1.toString())

    gradient.addColorStop(gradientRadiusInterval, c2.toString())

    gradient.addColorStop(1, c1.toString())
    p5.drawingContext.fillStyle = gradient

    const corners = polygon(p5, { x: 0, y: 0, radius, points })

    const dist = corners[0].dist(corners[1])
    p5.noFill()
    p5.stroke(p5.color(gradientHue, 40, 100))
    p5.strokeWeight(5 * gradientRadiusInterval - 1)
    for (const [i, v] of corners.entries()) {
      if (i === excluded) {
        continue
      }
      const previous = corners[i - 1] || corners[corners.length - 1]
      const next = corners[i + 1] || corners[0]
      p5.push()

      p5.arc(
        v.x,
        v.y,
        dist,
        dist,
        previous.copy().sub(v).heading(),
        next.copy().sub(v).heading(),
      )

      p5.pop()
    }

    p5.pop()
  }

  const destroy = () => {
    onDestroy(id)
  }

  return {
    draw,
    position,
  }
}

const polygon = (p5, { x, y, radius, points }) => {
  const angle = p5.TWO_PI / points
  const corners = []

  p5.beginShape()
  for (let i = 0; i < p5.TWO_PI; i += angle) {
    const sx = x + p5.sin(i) * radius
    const sy = y + p5.cos(i) * radius
    corners.push(p5.createVector(sx, sy))
    p5.vertex(sx, sy)
  }
  p5.endShape(p5.CLOSE)
  return corners
}

export default () => <P5Wrapper sketch={sketch} />

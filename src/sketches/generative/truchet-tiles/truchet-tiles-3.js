import { getCanvasSize } from '../../../utility/canvas'
import { generateOscillatingNumber } from '../../../utility/numbers'
import { v4 as uuid } from 'uuid'

let backgroundColor = 0

export const truchetPatterns = (p5) => {
  const tiles = new Map()
  const tileCount = 10
  let rowCount
  let radius
  let faceSize = 0
  // triangle rows need to be offset by half of the radius
  // to fit on top one another
  let topRowHasOffset = false

  p5.setup = () => {
    p5.colorMode(p5.HSB)
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    radius = p5.width > p5.height ? p5.width / tileCount : p5.height / tileCount
    faceSize = p5.sin(p5.TWO_PI / 3) * radius * 2
    rowCount = p5.height / faceSize
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    radius = (p5.width * 2) / tileCount
    p5.resizeCanvas(width, height)
  }

  const triangleRow = (y) => {
    const sx = p5.sin(p5.TWO_PI / 3) * radius
    const hue = getHue()
    const gradientHue = getGradientHue()
    for (let i = 0; i < tileCount * 1.5; i++) {
      const rotation = i % 2 === 0 ? 0 : p5.PI
      const rotationOffset = (p5.random([0, 1, 2, 3, 4]) * p5.TWO_PI) / 3

      // make each triangle align with the row
      let yOffset = rotation !== 0 ? radius / 2 : 0
      yOffset -= radius / 2
      // every other row is offset by the radius

      let xOffset = !topRowHasOffset ? -radius + (radius - sx) : 0
      xOffset += i * -(radius - sx)
      const position = p5.createVector(
        i * radius + xOffset,
        y + yOffset - radius / 2,
      )
      addTile({
        position,
        radius,
        points: 3,
        rotation: rotation + rotationOffset,
        hue,
        gradientHue,
      })
    }
    topRowHasOffset = !topRowHasOffset
  }

  const squareRow = (y) => {
    const hue = getHue()
    const gradientHue = getGradientHue()
    const diagonal = faceSize * Math.sqrt(2)
    const squareRadius = diagonal / 2
    for (let i = 0; i < tileCount * 0.75; i++) {
      const rotation = 0
      // rotate by 45 degrees
      const rotationOffset = p5.PI / 4
      const yOffset = diagonal / 2 - faceSize / 2
      const xOffset = topRowHasOffset ? -faceSize / 2 : 0
      const position = p5.createVector(
        i * faceSize + xOffset,
        y - yOffset - radius / 2,
      )

      addTile({
        position,
        radius: squareRadius,
        points: 4,
        rotation: rotation + rotationOffset,
        hue,
        gradientHue,
      })
    }
  }

  const hexagonRow = (y) => {
    const hue = getHue()
    const gradientHue = getGradientHue()
    const diagonal = faceSize
    const sx = p5.sin(p5.TWO_PI / 6) * diagonal

    for (let i = 0; i < tileCount * 0.5; i++) {
      const rotation = p5.PI / 6

      const yOffset = diagonal - (diagonal - sx)
      let xOffset = topRowHasOffset ? -faceSize / 2 : 0
      xOffset += i * diagonal * 2
      const position = p5.createVector(xOffset, y - yOffset)

      // add hexagon
      addTile({
        position,
        radius: diagonal,
        points: 6,
        rotation,
        hue,
        gradientHue,
      })
      const triangleXOffset = xOffset + diagonal

      const topTrianglePos = p5.createVector(
        triangleXOffset,
        y - yOffset - radius,
      )
      // add triangles to the right
      addTile({
        position: topTrianglePos,
        radius,
        points: 3,
        rotation: 0,
        hue,
        gradientHue,
      })
      const bottomTrianglePos = p5.createVector(
        triangleXOffset,
        y - yOffset + radius,
      )

      addTile({
        position: bottomTrianglePos,
        radius: radius,
        points: 3,
        rotation: p5.PI,
        hue,
        gradientHue,
      })
    }
  }
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
        faceSize,
        isWild: wildFactor,
        onDestroy: onDestroyTile,
      }),
    )
  }

  p5.mousePressed = () => {
    isRandomizingMode = false
    switchMode()
  }

  const rowTypes = {
    triangle: triangleRow,
    square: squareRow,
    hexagon: hexagonRow,
  }
  let nextRow
  const modes = [
    'alternating',
    'squares_only',
    'triangles_only',
    'random',
    'hexagons_only',
  ]

  let mode
  let isRandomizingMode = true
  let wildFactor = false
  const switchMode = (m = p5.random(modes)) => {
    console.log('switched to mode', mode)
    mode = m
  }

  switchMode('alternating')
  // add a row on top of the top row
  const addRow = () => {
    if (tiles.size > tileCount * 1.5 * (rowCount + 2)) {
      return
    }
    const topY = Array.from(tiles.values()).reduce((acc, tile) => {
      return tile.getTopEdge() < acc ? tile.getTopEdge() : acc
    }, p5.height)
    if (topY < 0 - radius) return
    switch (mode) {
      case 'alternating':
        nextRow =
          nextRow === rowTypes.triangle ? rowTypes.hexagon : rowTypes.triangle
        break
      case 'random':
        nextRow = p5.random(Object.values(rowTypes))
        break
      case 'squares_only':
        nextRow = rowTypes.square
        break
      case 'hexagons_only':
        nextRow = rowTypes.hexagon
        break
      case 'triangles_only':
      default:
        nextRow = rowTypes.triangle
    }
    nextRow(topY)
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

  const getSaturation = generateOscillatingNumber({
    initialValue: p5.random(20, 100),
    min: 20,
    max: 100,
    increment: p5.random(0.1, 0.3),
  })

  const getGradientSaturation = generateOscillatingNumber({
    initialValue: p5.random(20, 100),
    min: 20,
    max: 100,
    increment: 0.1,
  })

  const getYVelocity = generateOscillatingNumber({
    initialValue: 1,
    min: 1,
    max: 2,
    easing: 0.001,
    restFrames: 500,
  })

  const getStrokeWeight = generateOscillatingNumber({
    initialValue: 0,
    min: 0,
    max: 4,
    easing: 0.001,
    restFrames: 300,
  })

  const getStrokeBrightness = generateOscillatingNumber({
    initialValue: p5.random(0, 100),
    min: 0,
    max: 100,
    increment: p5.random(0.1, 0.3),
  })

  p5.draw = () => {
    if (isRandomizingMode && p5.frameCount % 1000 === 0) {
      switchMode()
      wildFactor = !wildFactor
    }

    addRow()
    const yVelocity = getYVelocity()
    const gradientBrightness = getGradientBrightness()
    const gradientRadiusInterval = getGradientRadiusInterval() / 100
    const strokeWeight = getStrokeWeight()
    const saturation = getSaturation()
    const gradientSaturation = getGradientSaturation()
    const strokeBrightness = getStrokeBrightness()
    tiles.forEach((tile) => {
      tile.draw({
        gradientRadiusInterval,
        yVelocity,
        gradientBrightness,
        strokeWeight,
        saturation,
        gradientSaturation,
        strokeBrightness,
      })
    })
  }
}

const tile = (
  p5,
  {
    position,
    radius,
    points = 3,
    rotation,
    id,
    onDestroy,
    hue = 0,
    gradientHue,
    faceSize,
    isWild = false,
  },
) => {
  let corners = []
  const excludable = []
  for (let i = 0; i < points; i++) {
    excludable.push(i)
  }
  const excluded = p5.random(excludable)

  const wildFactor = generateOscillatingNumber({
    initialValue: p5.random(0, 100),
    min: 0,
    max: 100,
    easing: 0.005 * p5.random(0.5, 2),
    restFrames: p5.random(0, 100),
  })

  const isOutOfBounds = () => {
    return position.y - radius > p5.height
  }

  const getTopEdge = () => {
    const lowestY = corners.reduce((acc, corner) => {
      return corner.y < acc ? corner.y : acc
    }, p5.height + radius)
    return position.y + lowestY
  }

  const draw = ({
    gradientRadiusInterval,
    yVelocity = 1,
    gradientBrightness,
    strokeWeight,
    saturation,
    gradientSaturation,
    strokeBrightness,
  }) => {
    if (isOutOfBounds()) {
      destroy()
    }

    position.y += yVelocity
    p5.push()
    p5.translate(position.x, position.y)

    p5.strokeWeight(0)

    const gradient = p5.drawingContext.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      radius,
    )

    let c1 = p5.color(hue, saturation, gradientBrightness)
    let c2 = p5.color(gradientHue, gradientSaturation, 100)
    gradient.addColorStop(0, c1.toString())

    gradient.addColorStop(
      isWild ? wildFactor() / 100 : gradientRadiusInterval,
      c2.toString(),
    )

    gradient.addColorStop(1, c1.toString())
    p5.drawingContext.fillStyle = gradient
    corners = polygon(p5, { x: 0, y: 0, radius, points, rotation })

    const dist = faceSize
    p5.noFill()
    p5.stroke(p5.color(gradientHue, 40, strokeBrightness))
    p5.strokeWeight(strokeWeight)
    for (let i = 0; i < points; i++) {
      if (i === excluded) {
        continue
      }
      const v = corners[i]
      const length = corners.length
      const previous = corners[(i + length - 1) % length]
      const next = corners[(i + 1) % length]
      if (!previous || !next) continue

      p5.arc(
        v.x,
        v.y,
        dist,
        dist,
        previous.copy().sub(v).heading(),
        next.copy().sub(v).heading(),
      )
    }

    p5.pop()
  }

  const destroy = () => {
    onDestroy(id)
  }

  return {
    draw,
    getTopEdge,
  }
}

const polygon = (p5, { x, y, radius, points, rotation }) => {
  const angle = p5.TWO_PI / points
  const corners = []

  p5.beginShape()
  for (let i = 0; i < points; i++) {
    let a = i * angle
    const sx = x + p5.sin(a) * radius
    const sy = y + p5.cos(a) * radius
    let v = p5.createVector(sx, sy)
    v.rotate(rotation)
    corners.push(v)
    p5.vertex(v.x, v.y)
  }
  p5.endShape()
  return corners
}

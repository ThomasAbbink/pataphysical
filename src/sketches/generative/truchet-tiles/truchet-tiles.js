import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { generateOscillatingNumber } from '../../../utility/numbers'
import { P5Wrapper } from '../../P5Wrapper'

let isFlipping = false
const sketch = (p5) => {
  let tileSize
  const tiles = []
  let backgroundColor = p5.color(33, 33, 40)
  let getBezierOffset
  let getSizeMultiplier
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    tileSize = p5.height / 10

    getBezierOffset = generateOscillatingNumber({
      min: -tileSize / 10,
      max: 0,
      increment: tileSize / 500,
    })
    getSizeMultiplier = generateOscillatingNumber({
      min: 0,
      max: 2,
      increment: 0.01,
    })
    for (let x = 0; x < p5.width / tileSize; x++) {
      for (let y = 0; y < p5.height / tileSize; y++) {
        tiles.push(tile(p5, { x, y, size: tileSize }))
      }
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    if (!isFlipping) {
      randomFlip(p5, tiles)
    }

    p5.background(backgroundColor)

    const bezierOffset = getBezierOffset()
    const sizeMultiplier = getSizeMultiplier()
    tiles.forEach((t) => {
      t.draw({ bezierOffset, sizeMultiplier })
    })
  }
}

const randomFlip = (p5, tiles) => {
  const pattern = p5.random(patterns)
  flipTiles(p5, tiles, pattern)
}

const flipTiles = (p5, tiles, matcher) => {
  let count = 0
  isFlipping = true
  const direction = p5.random([true, false])
  const rotations = p5.random([1, 2])
  let interval = setInterval(() => {
    const matches = tiles.filter(matcher(count, tiles))
    if (!matches.length) {
      //  flipped through all tiles
      clearInterval(interval)
      setTimeout(() => {
        isFlipping = false
      }, 2000 + tiles.length * 100)
      return
    }
    matches.forEach((tile) => {
      tile.startRotating({ direction, r: rotations })
    })

    count++
  }, 200)
}

const topLeftToBottomRight = (count) => (t) => t.x + t.y === count

const bottomRightToTopLeft = (count, tiles) => (tile) => {
  const max = tiles.reduce((acc, curr) => {
    return curr.x + curr.y > acc ? curr.x + curr.y : acc
  }, 0)

  return tile.x + tile.y === max - count
}

const leftToRight = (count) => (t) => t.x === count

const rightToLeft = (count, tiles) => (tile) => {
  const maxX = tiles.reduce((acc, curr) => {
    return curr.x > acc ? curr.x : acc
  }, 0)
  return tile.x === maxX - count
}

const topToBottom = (count) => (t) => t.y === count

const bottomToTop = (count, tiles) => (tile) => {
  const maxY = tiles.reduce((acc, curr) => {
    return curr.y > acc ? curr.y : acc
  }, 0)
  return tile.y === maxY - count
}

const patterns = [
  topLeftToBottomRight,
  bottomRightToTopLeft,
  leftToRight,
  topToBottom,
  bottomToTop,
  rightToLeft,
]

const tile = (p5, { x, y, size }) => {
  let rotationOffset = 0
  let rotation = ((x + y) % 4) + 1
  let lineColor = p5.color(130, 150, 200)

  const draw = ({ bezierOffset, sizeMultiplier }) => {
    if (isRotating) {
      rotate()
    }

    p5.push()
    p5.translate(x * size + size / 2, y * size + size / 2) // 0, 0 is now in the center of the tile
    p5.rotate((p5.PI / 2) * rotation + rotationOffset)

    p5.noStroke()

    p5.strokeWeight(p5.map(size, 30, 100, 1, 5, true))

    p5.stroke(lineColor)
    p5.noFill()

    const offsets = [-40, -20, 20, 40]
      .map((o) => o * sizeMultiplier)
      .map((o) => {
        const mod = bezierOffset
        return o > 0 ? o + mod : o - mod
      })

    offsets.forEach((offset) => {
      p5.arc(-size / 2, -size / 2, size + offset, size + offset, 0, p5.PI / 2)
      p5.arc(
        size / 2,
        size / 2,
        size + offset,
        size + offset,
        p5.PI,
        p5.PI + p5.HALF_PI,
      )
    })

    p5.pop()
  }

  const randomizeRotation = () => {
    rotation = p5.random([1, 2, 3, 4])
  }

  randomizeRotation()

  let isRotating = false
  let rotationDirection = true
  let rotations = 1
  const startRotating = ({ direction = true, r = p5.random([1, 2]) }) => {
    rotationDirection = direction
    isRotating = true
    rotations = r
  }

  let currentRotationOffset = 0
  // TODO: add easing
  const rotate = () => {
    const increment = p5.PI / 90
    if (rotationDirection) {
      rotationOffset += increment
      currentRotationOffset += increment
    } else {
      rotationOffset -= increment
      currentRotationOffset += increment
    }

    if (currentRotationOffset >= (p5.PI / 2) * rotations) {
      isRotating = false
      currentRotationOffset = 0
    }
  }

  return {
    draw,
    startRotating,
    x,
    y,
  }
}

export default () => <P5Wrapper sketch={sketch} />

import { getPalette } from '../color-palettes'
import { Vector } from 'p5'
import { line } from './line'

/**
 * A pattern represents a lifetime of a collection of lines
 * a pattern has a start, duration and end
 * a pattern describes the starting Position(s) of lines, their target
 * and their movement
 */

// const center = (p5) => p5.createVector(0, 0)

// const randomEdge = (p5) => {
//   const vec = Vector.random2D()
//   vec.setMag(p5.width / 2)
//   return vec
// }

const randomLeftEdge = (p5) => {
  return p5.createVector(
    -p5.width / 2,
    p5.random(-p5.height / 2, p5.height / 2),
    true,
  )
}

const randomRightEdge = (p5) => {
  return p5.createVector(
    p5.width / 2,
    p5.random(-p5.height / 2, p5.height / 2),
    true,
  )
}

const randomTopEdge = (p5) => {
  return p5.createVector(
    p5.random(-p5.width / 2, p5.width / 2),
    -p5.height / 2,
    true,
  )
}
const randomBottomEdge = (p5) => {
  return p5.createVector(
    p5.random(-p5.width / 2, p5.width / 2),
    p5.height / 2,
    true,
  )
}

// const insideOut = { startPosition: center, targetPosition: randomEdge }
// const outsideIn = { startPosition: randomEdge, targetPosition: center }
const leftToRight = {
  startPosition: randomLeftEdge,
  targetPosition: randomRightEdge,
}
const rightToLeft = {
  startPosition: randomRightEdge,
  targetPosition: randomLeftEdge,
}
const topToBottom = {
  startPosition: randomTopEdge,
  targetPosition: randomBottomEdge,
}

const bottomToTop = {
  startPosition: randomBottomEdge,
  targetPosition: randomTopEdge,
}

export const createPattern = (p5, { getPixelData }) => {
  let isStopping = false
  const palette = getPalette(p5)
  const lines = []
  const pattern = p5.random([
    leftToRight,
    rightToLeft,
    // insideOut,
    // outsideIn,
    bottomToTop,
    topToBottom,
  ])
  const addLine = () => {
    const l = line(p5, {
      startPosition: pattern.startPosition(p5),
      targetPosition: pattern.targetPosition(p5),
      color: p5.random(palette),
      getPixelData,
      speedLimit: p5.random(1, 4),
    })
    lines.push(l)
  }

  const update = () => {
    if (!isStopping && p5.frameCount % 4 === 0) {
      addLine()
    }
    lines.forEach((line, index) => {
      line.update()
      if (line.isAtTarget()) {
        lines.splice(index, 1)
      }
    })
  }

  const isDone = () => {
    return isStopping && lines.length === 0
  }

  const stop = () => {
    isStopping = true
  }

  return {
    update,
    isDone,
    stop,
  }
}

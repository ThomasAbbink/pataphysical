import React from 'react'
import { P5Wrapper } from '../P5Wrapper'
import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
const mic = new p5.AudioIn()

const sketch = (p) => {
  const vectors = []
  let size = 100
  const state = {
    to: 0,
  }
  const randomShape = []
  // const mic = new p.AudioIn()
  const getNextShape = () => {
    const next = state.to === shapes.length - 1 ? 0 : state.to + 1

    return next
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.stroke(255)
    p.noFill()
    mic.start()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
  p.draw = () => {
    p.translate(p.width / 2, p.height / 2)
    p.background(0)
    const { to } = state
    const level = mic.getLevel()

    const beat = 1 + level
    console.log(beat)
    if (beat > 1.2) {
      size = Math.round(beat)
    } else {
      size = 100
    }
    p.ellipse(0, 0, 100 * beat, 100 * beat)
    const done = shapes[to]()
    if (done) {
      state.to = getNextShape()
    }
    drawLines(vectors)
    drawLines(vectors)
  }

  const drawLines = (vectors) => {
    for (let i = 0; i < vectors.length; i++) {
      const vector2 = i === vectors.length - 1 ? 0 : i + 1
      p.line(vectors[i].x, vectors[i].y, vectors[vector2].x, vectors[vector2].y)
      // p.text(i, vectors[i].x, vectors[i].y)
    }
  }

  const dot = () => {
    const shape = [p.createVector(0, 0)]
    return toShape(shape)
  }

  const triangle = () => {
    const shape = [
      p.createVector(size, -size),
      p.createVector(0, size),
      p.createVector(-size, -size),
    ]
    return toShape(shape)
  }

  const square = () => {
    const shape = [
      p.createVector(size, size),
      p.createVector(-size, size),
      p.createVector(-size, -size),
      p.createVector(size, -size),
    ]
    return toShape(shape)
  }

  const star = () => {
    const shape = [
      p.createVector(0, -size),
      p.createVector(0.3 * size, -(0.3 * size)),
      p.createVector(size, 0),
      p.createVector(0.3 * size, 0.3 * size),
      p.createVector(0, size),
      p.createVector(-(0.3 * size), 0.3 * size),
      p.createVector(-size, 0),
      p.createVector(-(0.3 * size), -(0.3 * size)),
    ]
    return toShape(shape)
  }

  const octagon = () => {
    const shape = [
      p.createVector(0, -size),
      p.createVector(0.66 * size, -(0.66 * size)),
      p.createVector(size, 0),
      p.createVector(0.66 * size, 0.66 * size),
      p.createVector(0, size),
      p.createVector(-(0.66 * size), 0.66 * size),
      p.createVector(-size, 0),
      p.createVector(-(0.66 * size), -(0.66 * size)),
    ]
    return toShape(shape)
  }

  const random = () => {
    const num = 100
    const factor = 2
    if (!randomShape[0]) {
      for (let i = 0; i < num; i++) {
        const x = getRandomInt(-size * factor, size * factor)
        const y = getRandomInt(-size * factor, size * factor)
        randomShape[i] = p.createVector(x, y)
      }
    }
    return toShape(randomShape)
  }

  const shapes = [dot, triangle, square, star, octagon]

  const toShape = (shape) => {
    if (vectors.length < shape.length) {
      const x = vectors[0] ? vectors[0].x : 0
      const y = vectors[0] ? vectors[0].y : 0
      vectors.push(p.createVector(x, y))
    }
    let done = true
    for (let i = 0; i < vectors.length; i++) {
      const shapeIndex = i % shape.length
      const target = shape[shapeIndex]
      if (vectors[i].x < target.x) {
        vectors[i].x = vectors[i].x + 1
        done = false
      }
      if (vectors[i].x > target.x) {
        vectors[i].x = vectors[i].x - 1
        done = false
      }
      if (vectors[i].y < target.y) {
        vectors[i].y = vectors[i].y + 1
        done = false
      }
      if (vectors[i].y > target.y) {
        vectors[i].y = vectors[i].y - 1
        done = false
      }
    }
    return done
    return vectors.every((vector, index) => {
      return (
        vector.x === shape[index % shape.length].x &&
        vector.y === shape[index % shape.length].y
      )
    })
  }
}

export default () => <P5Wrapper sketch={sketch} />

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

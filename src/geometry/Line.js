import React from 'react'
import { P5Wrapper } from '../P5Wrapper'
import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
const mic = new p5.AudioIn()

const sketch = (p) => {
  const vectors = []
  const baseSize = 100
  let size = baseSize
  let beat = 1
  let beatFactor = 2
  const state = {
    to: 0,
  }
  let r = 0
  let b = 0
  let g = 0
  const randomShape = []

  const getNextShape = () => {
    return getRandomInt(0, shapes.length)
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

    beat = 1 + level * beatFactor
    r = r + getRandomInt(0, 5)
    g = g + getRandomInt(0, 5)
    b = b + getRandomInt(0, 5)
    p.stroke((r % 255) + 50, (g % 255) + 50, (b % 255) + 50)
    p.ellipse(0, 0, 20 * beat, 20 * beat)

    for (let i = 0; i < 10; i++) {
      if (level > 1 * (i / 200)) {
        p.ellipse(0, 0, i * 20 * beat, i * 20 * beat)
      }
    }
    size = Math.round(baseSize * beat)

    const done = shapes[to]()
    if (done) {
      state.to = getNextShape()
    }
    drawLines(vectors)
  }

  p.touchStarted = () => {
    p.getAudioContext().resume()
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
    const num = 30
    const factor = 2
    if (!randomShape[0]) {
      for (let i = 0; i < num; i++) {
        const x = getRandomInt(-baseSize * factor, baseSize * factor)
        const y = getRandomInt(-baseSize * factor, baseSize * factor)
        randomShape[i] = p.createVector(x, y)
      }
    }
    return toShape(randomShape)
  }

  const complexOctagon = () => {
    let shape = []
    for (let i = 0; i < 8; i++) {
      const f = 0.33 * i
      shape = [
        ...shape,
        p.createVector(0, -size),
        p.createVector(f * size, -(f * size)),
        p.createVector(size, 0),
        p.createVector(f * size, f * size),
        p.createVector(0, size),
        p.createVector(-(f * size), f * size),
        p.createVector(-size, 0),
        p.createVector(-(f * size), -(f * size)),
      ]
    }
    return toShape(shape)
  }

  const squareWeb = () => {
    let shape = []
    for (let i = 1; i < 8; i++) {
      const w = (size / 4) * i
      const h = w
      shape.push(p.createVector(0, -h))
      shape.push(p.createVector(w, 0))
      shape.push(p.createVector(0, h))
      shape.push(p.createVector(-w, 0))
      shape.push(p.createVector(w, 0))
      shape.push(p.createVector(-w, 0))
      shape.push(p.createVector(0, -h))
      shape.push(p.createVector(0, h))
    }

    return toShape(shape)
  }

  const triangles = () => {
    const shape = []
    for (let i = 8; i > 0; i--) {
      const s = (size / 4) * i
      const s2 = s / 2
      shape.push(p.createVector(s, -s))
      shape.push(p.createVector(0, s))
      shape.push(p.createVector(-s, -s))
      shape.push(p.createVector(s2, -s2))
      shape.push(p.createVector(0, s2))
      shape.push(p.createVector(-s2, -s2))
    }
    return toShape(shape)
  }

  const shapes = [
    dot,
    triangle,
    square,
    star,
    octagon,
    random,
    complexOctagon,
    squareWeb,
    triangles,
  ]
  // const shapes = [triangles]

  const toShape = (shape) => {
    if (vectors.length < shape.length || vectors.length % shape.length !== 0) {
      const x = vectors[0] ? vectors[0].x : 0
      const y = vectors[0] ? vectors[0].y : 0
      vectors.push(p.createVector(x, y))
    }
    for (let i = 0; i < vectors.length; i++) {
      const shapeIndex = i % shape.length
      const target = shape[shapeIndex]
      if (vectors[i].x < target.x) {
        vectors[i].x = vectors[i].x + 1
      }
      if (vectors[i].x > target.x) {
        vectors[i].x = vectors[i].x - 1
      }
      if (vectors[i].y < target.y) {
        vectors[i].y = vectors[i].y + 1
      }
      if (vectors[i].y > target.y) {
        vectors[i].y = vectors[i].y - 1
      }
    }
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

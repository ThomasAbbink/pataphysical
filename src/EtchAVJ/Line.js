import React from 'react'
import { P5Wrapper } from '../P5Wrapper'
import p5 from 'p5'

const sketch = (shapes) => (p) => {
  console.log(shapes)
  const vectors = []
  let beat = 1
  let beatFactor = 2
  const state = {
    to: 0,
  }
  let r = 0
  let b = 0
  let g = 0

  const getNextShape = () => {
    return getRandomInt(0, shapes.length)
  }
  let mic

  p.setup = () => {
    mic = new p5.AudioIn()
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.stroke(255)
    p.noFill()
    mic.start()
    p.getAudioContext().resume()
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
    p.strokeWeight(3)
    p.stroke((r % 255) + 50, (g % 255) + 50, (b % 255) + 50)
    p.ellipse(0, 0, 20 * beat, 20 * beat)

    for (let i = 0; i < 10; i++) {
      if (level > 1 * (i / 200)) {
        p.ellipse(0, 0, i * 20 * beat, i * 20 * beat)
      }
    }

    const shape = shapes[to]
    const done = toShape(shape, beat)
    if (done) {
      state.to = getNextShape()
    }
    drawLines(p, vectors)
  }

  p.touchStarted = () => {
    p.getAudioContext().resume()
  }

  const toShape = (shape, beat = 1) => {
    const { vectors: shapeVectors } = shape
    const shapeP5Vectors = shapeVectors().map((v) => {
      const x = Math.round(v.x * beat)
      const y = Math.round(v.y * beat)
      return p.createVector(x, y)
    })
    if (
      vectors.length < shapeP5Vectors.length ||
      vectors.length % shapeP5Vectors.length !== 0
    ) {
      const x = vectors[0] ? vectors[0].x : 0
      const y = vectors[0] ? vectors[0].y : 0
      vectors.push(p.createVector(x, y))
    }
    for (let i = 0; i < vectors.length; i++) {
      const shapeIndex = i % shapeP5Vectors.length
      const target = shapeP5Vectors[shapeIndex]
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
        vector.x === shapeP5Vectors[index % shapeP5Vectors.length].x &&
        vector.y === shapeP5Vectors[index % shapeP5Vectors.length].y
      )
    })
  }
}

export const drawLines = (p, vectors) => {
  for (let i = 0; i < vectors.length - 1; i++) {
    const vector1 = vectors[i]
    const vector2 = vectors[i + 1]
    p.line(vector1.x, vector1.y, vector2.x, vector2.y)
    // p.text(i, vector1.x, vector1.y)
  }
}

export default ({ shapes = [] }) => {
  const s = sketch(shapes)
  return <P5Wrapper sketch={s} />
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

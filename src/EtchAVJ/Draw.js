import React, { useState, useEffect } from 'react'
import { P5Wrapper } from '../P5Wrapper'
import { drawLines } from './Line'

const sketch = (initialVectors = [], onSave) => (p) => {
  let vectors = []
  let save, clear, undo
  p.setup = () => {
    vectors = initialVectors.map((v) => {
      return p.createVector(v.x, v.y)
    })
    p.createCanvas(p.windowWidth, p.windowHeight)
    save = p.createButton('Save')
    save.mousePressed(onPressSave)
    clear = p.createButton('clear')
    clear.mousePressed(onPressClear)
    undo = p.createButton('undo')
    undo.mousePressed(onPressUndo)
    positionButtons()
  }

  const onPressUndo = () => vectors.pop()
  const onPressClear = () => {
    vectors = []
  }
  const onPressSave = () => {
    onSave(vectors)
  }
  const positionButtons = () => {
    p.translate(p.width / 2, p.height / 2)
    save.position(p.width - 50, 50)
    undo.position(p.width - 50, 100)
    clear.position(p.width - 50, 150)
  }
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    positionButtons()
  }

  p.draw = () => {
    p.background(230, 230, 230)
    p.translate(p.width / 2, p.height / 2)
    p.ellipse(0, 0, 10, 10)
    drawGrid(vectors)
    drawSelected(vectors)
    drawLines(p, vectors)
  }

  const drawSelected = (p5Vectors) => {
    p.push()

    for (let i = 0; i < p5Vectors.length; i++) {
      p.strokeWeight(6)
      p.stroke(50, 50, 200)
      p.point(p5Vectors[i].x, p5Vectors[i].y)
    }
    p.pop()
  }

  const drawGrid = (p5Vectors) => {
    const points = []
    for (let i = 0; i < p.width / 2; i += 20) {
      for (let j = 0; j < p.height / 2; j += 20) {
        const x = i
        const y = j
        points.push(p.createVector(x, y))
        points.push(p.createVector(-x, y))
        points.push(p.createVector(x, -y))
        points.push(p.createVector(-x, -y))
      }
    }
    for (const point of points) {
      const x = point.x
      const y = point.y
      const hover = isHovered({ x: x + p.width / 2, y: y + p.height / 2, p })
      p.strokeWeight(2)

      if (p.mouseIsPressed && hover) {
        p.strokeWeight(4)
        const vector = p.createVector(x, y)
        if (!isSameAsPrevVector(p5Vectors, vector)) {
          vectors.push(p.createVector(x, y))
        }
      }
      if (hover) {
        if (p5Vectors.length) {
          p.line(
            p5Vectors[vectors.length - 1].x,
            p5Vectors[vectors.length - 1].y,
            x,
            y,
          )
        }
        p.strokeWeight(4)
      }
      p.point(point.x, point.y)
    }
  }
}

const hasVector = (p5Vectors, vector) => {
  return p5Vectors.some((v) => v.x === vector.x && v.y === vector.y)
}

const isSameAsPrevVector = (p5Vectors, vector) => {
  if (!p5Vectors || !p5Vectors.length) {
    return false
  }
  const prev = p5Vectors[p5Vectors.length - 1]
  return prev.x === vector.x && prev.y === vector.y
}

const isHovered = ({ x, y, p }) => {
  const hovered =
    p.mouseX > x - 8 && p.mouseX < x + 8 && p.mouseY > y - 8 && p.mouseY < y + 8

  return hovered
}

export default ({ initialVectors, onAddVector }) => {
  const s = sketch(initialVectors, onAddVector)
  return <P5Wrapper sketch={s} />
}

function round_to_precision(x, precision) {
  var y = +x + (precision === undefined ? 0.5 : precision / 2)
  return y - (y % (precision === undefined ? 1 : +precision))
}

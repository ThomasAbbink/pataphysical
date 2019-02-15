import 'p5/lib/addons/p5.dom'
import P5Wrapper from 'react-p5-wrapper'
import React from 'react'

const p = p => {
  const radius = 300
  let points = 200
  let factor = 0
  let isCountingUp = true
  let rate = 0.005
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(0)
    p.noFill()
    p.stroke(255)
    p.translate(p.width / 2, p.height / 2)
    p.ellipse(0, 0, radius * 2, radius * 2)
    for (let i = 0; i < points; i++) {
      const vector = getVector(i)
      p.fill(255)
      // p.ellipse(vector.x, vector.y, 5, 5)
      const vector2 = getVector(i * factor)
      p.line(vector.x, vector.y, vector2.x, vector2.y)
    }
    if (factor > 10 || factor < 0) {
      isCountingUp = !isCountingUp
    }
    isCountingUp ? (factor += rate) : (factor -= rate)
  }

  const getVector = index => {
    const angle = p.map(index % points, 0, points, 0, p.TWO_PI)
    const x = radius * p.cos(angle)
    const y = radius * p.sin(angle)
    return p.createVector(x, y)
  }
}

export default () => <P5Wrapper sketch={p} />

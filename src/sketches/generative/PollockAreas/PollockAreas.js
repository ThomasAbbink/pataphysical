import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import area from './area'
import { Vector } from 'p5'

const sketch = (p5) => {
  const areas = []
  let backgroundOpacity = 0.5
  let backgroundOpacityVelocity = 0

  let backgroundColor = 0
  const { width, height } = getCanvasSize()
  let start = p5.frameCount

  p5.setup = () => {
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
  }

  const addArea = (position, bounds = { width: 200, height: 200 }) => {
    const a = area(p5)
    a.setBounds(bounds)
    a.setPosition(position)
    areas.push(a)
  }

  const addRandomArea = () => {
    const v = Vector.random2D()
    v.setMag(p5.random(50, width / 2))
    const size = p5.random(100, 200)
    addArea(v, { width: size, height: size })
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.mousePressed = () => {
    const v = p5.createVector(p5.mouseX - width / 2, p5.mouseY - height / 2)
    addArea(v)
  }

  p5.draw = () => {
    start += 1
    p5.background(backgroundColor, backgroundOpacity)

    // move out: chaos everywhere
    if (start === 1000) {
      areas.forEach((area) => {
        area.setBounds({ width: p5.width / 2, height: p5.height / 2 })
      })
    }

    // // move back home
    if (start === 1500) {
      backgroundOpacityVelocity = 1
      areas.splice(0, areas.length / 2)
      areas.forEach((area) => {
        area.moveLinesBackHome()
        const size = p5.random(100, 200)
        area.setBounds({ width: size, height: size })
      })
    }

    // reset
    if (backgroundOpacity > 255) {
      backgroundColor = backgroundColor === 0 ? 255 : 0
      p5.background(backgroundColor)
      backgroundOpacity = 0
      backgroundOpacityVelocity = 0
      start = 0
    }

    if (start % 100 === 0) {
      if (areas.length < 24) {
        addRandomArea()
      }
    }

    p5.translate(p5.width / 2, p5.height / 2)

    areas.forEach((area) => {
      area.update()
    })

    backgroundOpacity += backgroundOpacityVelocity
  }
}

export default () => <P5Wrapper sketch={sketch} />

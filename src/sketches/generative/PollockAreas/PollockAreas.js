import { getCanvasSize } from '../../../utility/canvas'
import area from './area'
import { Vector } from 'p5'

export const pollockAreas = (p5) => {
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

  const addArea = (position) => {
    const a = area(p5)
    a.setBounds(getRandomBounds())
    a.setPosition(position)
    areas.push(a)
  }

  const getRandomBounds = () => {
    const minSize = p5.map(p5.width, 300, 1920, 30, 100)
    const size = p5.random(minSize, minSize * 2)
    return { width: size, height: size }
  }

  const addRandomArea = () => {
    const v = Vector.random2D()
    v.setMag(p5.random(50, width / 2))
    addArea(v)
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
        area.setBounds({ width: p5.width / 4, height: p5.height / 4 })
      })
    }

    // // move back home
    if (start === 1500) {
      backgroundOpacityVelocity = 1
      areas.splice(0, areas.length / 2)
      areas.forEach((area) => {
        area.moveLinesBackHome()

        area.setBounds(getRandomBounds())
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

pollockAreas.date = '2021-06-24'

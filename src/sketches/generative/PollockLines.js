import { getCanvasSize } from '../../utility/canvas'
import { Vector } from 'p5'
import { getPalette } from './color-palettes'

let colors = []
export const pollockLines = (p5) => {
  const flubs = new Set()

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    colors = getPalette(p5)
    p5.background(p5.color(255, 255, 255))
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    if (flubs.size < 200) {
      addFlub(p5)
    }
    p5.translate(p5.width / 2, p5.height / 2)

    flubs.forEach((flub) => {
      flub.update()
    })
  }
  const addFlub = (p5) => {
    flubs.add(flurble(p5))
  }
}

const flurble = (p5) => {
  const color = p5.random(colors)

  const thickness = p5.random(5, 12)
  const position = p5.createVector(0, 0)
  const velocity = p5.createVector(0, 0)
  let acceleration = Vector.random2D()
  let angle = 0
  let angleVelocity = p5.random(-(p5.PI / 100), p5.PI / 100)

  let rad = p5.random(-50, 50)
  const isOutOfBounds = () => {
    return (
      Math.abs(position.x) > p5.width / 2 - rad ||
      Math.abs(position.y) > p5.height / 2 - rad
    )
  }

  const update = () => {
    p5.push()

    p5.stroke(color)
    p5.fill(color)
    p5.translate(position)
    p5.rotate(angle)
    p5.ellipse(rad, rad, thickness, thickness)

    if (isOutOfBounds()) {
      acceleration = Vector.random2D()
      angleVelocity = p5.random(-(p5.PI / 50), p5.PI / 50)
    }

    velocity.add(acceleration)
    velocity.limit(1)
    position.add(velocity)
    angle += angleVelocity
    p5.pop()
  }

  return {
    update,
    isOutOfBounds,
  }
}

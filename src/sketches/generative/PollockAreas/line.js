import { Vector } from 'p5'
import { distanceSquared } from '../../../utility/vectors'

/**
 * @param {width: number, height: number} bounds
 * @param {Vector} origin
 */
const line = (p5) => {
  let color = p5.color(0)
  let border = { width: 100, height: 100 }
  const thickness = p5.map(p5.width, 300, 1000, 2, 12, true)
  const position = p5.createVector(0, 0)
  let velocity = p5.createVector(0, 0)
  let acceleration = p5.createVector(0, 0)
  let target = Vector.random2D()
  let isMovingToCustomTarget = false

  const moveRandomly = () => {
    isMovingToCustomTarget = false
    if (target.x === 0 && target.y === 0) {
      target = Vector.random2D()
    }
    target.rotate(p5.random(p5.PI / 3, p5.PI / 2))
    target.setMag(10000)
  }
  moveRandomly()

  const setColor = (c) => {
    color = c
    return line
  }

  const setBounds = (newBounds) => {
    border = newBounds
    return line
  }

  const isOutOfBounds = () => {
    return (
      Math.abs(position.x) > border.width / 2 ||
      Math.abs(position.y) > border.height / 2
    )
  }

  const isAtTarget = () => {
    return distanceSquared(position, target) < 1
  }

  const update = () => {
    p5.push()

    p5.stroke(color)
    p5.fill(color)

    p5.ellipse(position.x, position.y, thickness, thickness)
    if (isOutOfBounds() && !isMovingToCustomTarget) {
      moveRandomly()
    }

    if (isAtTarget()) {
      moveRandomly()
    }

    acceleration = Vector.sub(target, position)
    velocity.add(acceleration)
    velocity.limit(2)
    position.add(velocity)
    p5.pop()
  }

  const setTarget = (t) => {
    isMovingToCustomTarget = true
    target = t
  }

  return {
    update,
    isOutOfBounds,
    setBounds,
    setColor,
    setTarget,
    moveRandomly,
  }
}

export default line

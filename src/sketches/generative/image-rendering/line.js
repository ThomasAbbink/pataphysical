import { Vector } from 'p5'

/**
 * @param {width: number, height: number} bounds
 * @param {Vector} origin
 */
const line = (p5) => {
  let color = p5.color(0)
  let border = { width: p5.width, height: p5.height }

  let position = p5.createVector(0, 0)
  let velocity = p5.createVector(0, 0)
  let acceleration = p5.createVector(0, 0)
  let target = Vector.random2D()

  let speed = 2
  let getPixelData = (position) => {}

  const maxAngle = p5.PI / 1800
  let angle = 0
  let angleVelocity = 0.00001

  const maxThickness = 8
  const minThickness = 0.01

  const moveRandomly = () => {
    if (target.x === 0 && target.y === 0) {
      target = Vector.random2D()
    }
    target.rotate(p5.random(p5.PI / 3, p5.PI / 2))
    target.setMag(border.width)
  }
  moveRandomly()

  const setColor = (c) => {
    color = c
    return line
  }

  const setBounds = (newBounds) => {
    border = newBounds
    position = p5.createVector(0, 0)
    return line
  }

  const isOutOfBounds = () => {
    return (
      Math.abs(position.x) > border.width / 2 ||
      Math.abs(position.y) > border.height / 2 ||
      Math.abs(angle) > maxAngle
    )
  }

  const setGetPixelData = (fun) => {
    getPixelData = fun
  }

  const update = () => {
    p5.push()
    // p5.translate(p5.width / 2, p5.height / 2)
    position.rotate(angle)

    const data = getPixelData(position)

    const total = data[0] + data[1] + data[2]
    let brightness = total ? total / 3 : 0
    const t = p5.map(brightness, 0, 128, maxThickness, minThickness, true)

    const alpha = p5.map(brightness, 255, 0, 0, 255, true)

    color.setAlpha(alpha)

    p5.fill(color)
    p5.stroke(color)

    p5.ellipse(position.x, position.y, t, t)

    acceleration = Vector.sub(target, position)
    velocity.add(acceleration)
    velocity.limit(speed)
    position.add(velocity)

    angle += angleVelocity
    if (angle > maxAngle) {
      angle = maxAngle
    }
    if (angle < 0 && Math.abs(angle) < maxAngle) {
      angle = -maxAngle
    }
    p5.pop()
  }

  const setTarget = (t) => {
    target = t
  }

  const setSpeed = (s) => {
    speed = s
  }

  return {
    update,
    isOutOfBounds,
    setBounds,
    setColor,
    setTarget,
    moveRandomly,
    setSpeed,
    setGetPixelData,
  }
}

export default line

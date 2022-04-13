import { Vector } from 'p5'
import { distanceSquared } from '../../../utility/vectors'

/**
 * @param {width: number, height: number} bounds
 * @param {Object} config
 */
export const line = (
  p5,
  { startPosition, targetPosition, color, getPixelData, speedLimit = 3 },
) => {
  let position = startPosition
  let velocity = p5.createVector(0, 0)
  let acceleration = p5.createVector(0, 0)

  const maxAngle = p5.PI / 3600
  let angle = 0
  let angleVelocity = 0.00002

  const maxThickness = 8
  const minThickness = 0.03

  const isAtTarget = () => {
    return distanceSquared(position, targetPosition) < 10
  }

  const update = () => {
    p5.push()
    targetPosition.rotate(angle)

    const data = getPixelData(position)

    const total = data[0] + data[1] + data[2]
    let brightness = total ? total / 3 : 0
    const t = p5.map(brightness, 0, 128, maxThickness, minThickness, true)

    const alpha = p5.map(brightness, 255, 0, 50, 255, true)

    color.setAlpha(alpha)

    p5.fill(color)
    p5.stroke(color)

    p5.ellipse(position.x, position.y, t, t)

    acceleration = Vector.sub(targetPosition, position)
    velocity.add(acceleration)
    velocity.limit(speedLimit)
    position.add(velocity)

    angle += angleVelocity
    if (angle > maxAngle) {
      angle = maxAngle
    }
    if (angle < 0 && Math.abs(angle) > maxAngle) {
      angle = -maxAngle
    }
    p5.pop()
  }

  return {
    update,
    isAtTarget,
  }
}

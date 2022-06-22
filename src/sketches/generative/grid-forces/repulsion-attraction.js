import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { Vector } from 'p5'
import { generateOscillatingNumber } from '../../../utility/numbers'
import { distanceSquared } from '../../../utility/vectors'

const sketch = (p5) => {
  let backgroundColor = p5.color(100, 130, 150)
  const gridPoints = []
  const movers = []
  let pixelCount = 0
  let maxDistance
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    pixelCount = width * height
    maxDistance = p5.map(pixelCount, 300 * 600, 1080 * 1920, 40, 120, true)
    p5.disableFriendlyErrors = true
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    p5.frameRate(30)
    gridPoints.push(dot(p5, { position: p5.createVector(0, 0) }))
    createMover(maxDistance)
    createMover(maxDistance)

    for (let i = 0; i < p5.width; i += p5.width / 50) {
      for (let j = 0; j < p5.height; j += p5.height / 50) {
        const position = p5.createVector(i, j)
        gridPoints.push(dot(p5, { position }))
      }
    }
  }

  const createMover = (maxDistance) => {
    movers.push(
      mover(p5, {
        initialPosition: p5.createVector(p5.width / 2, p5.height / 2),
        isPusher: true,
        maxDistance,
      }),
    )
  }

  const removeMover = () => {
    movers.pop()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    pixelCount = width * height

    p5.resizeCanvas(width, height)
  }

  const getDotHue = generateOscillatingNumber({
    min: 0,
    max: 360,
    increment: 0.1,
  })

  const getBackgroundHue = generateOscillatingNumber({
    min: 0,
    max: 360,
    increment: 0.1,
  })

  const getBackgroundSat = generateOscillatingNumber({
    min: 20,
    max: 30,
    increment: 0.1,
  })

  p5.draw = () => {
    const hue = getDotHue()

    p5.strokeWeight(p5.map(maxDistance, 40, 120, 4, 6, true))
    if (p5.frameCount % 500 === 0) {
      createMover(maxDistance)
      createMover(maxDistance)
      if (movers.length > 3) {
        removeMover()
        removeMover()
      }
    }
    const str = `hsb(${Math.floor(
      getBackgroundHue(),
    )}, ${getBackgroundSat()}%,10%)`

    p5.background(str)

    gridPoints.forEach((p) => {
      p.update({
        movers,
        maxDistance,
        hue: Math.floor(hue),
      })
    })

    movers.forEach((m) => {
      m.update()
    })
  }
}

const dot = (p5, { position }) => {
  const initialPosition = position.copy()
  let velocity = p5.createVector(0, 0)

  const isAtTarget = (target) => {
    return distanceSquared(position, target) < 1
  }

  const update = ({ movers = [], maxDistance, hue }) => {
    const closestMover = getClosestVector(position, movers)
    const maxDistanceSq = maxDistance * maxDistance
    const distanceFromMoverSq = distanceSquared(
      initialPosition,
      closestMover.position,
    )
    const distanceFromCenter = distanceSquared(
      initialPosition,
      p5.createVector(p5.width / 2, p5.height / 2),
    )
    const distToCorner = distanceSquared(
      p5.createVector(p5.width / 2, p5.height / 2),
      p5.createVector(0, 0),
    )
    const sat = p5.map(distanceFromCenter, 0, distToCorner / 2, 20, 100, true)

    const target =
      distanceFromMoverSq <= maxDistanceSq
        ? closestMover.position
        : initialPosition

    if (!isAtTarget(target)) {
      let acceleration = Vector.sub(target, position)
      velocity.add(acceleration)
      if (closestMover.isPusher && !target.equals(initialPosition)) {
        velocity.limit(
          p5.map(
            distanceSquared(position, target),
            0,
            maxDistanceSq,
            6,
            1,
            true,
          ),
        )
        velocity.rotate(p5.PI)
      } else {
        velocity.limit(
          p5.map(
            distanceSquared(position, target),
            0,
            maxDistanceSq,
            1,
            0.1,
            true,
          ),
        )
      }
      position.add(velocity)
      const alpha = p5.map(distanceFromMoverSq, 0, maxDistanceSq, 1, 0.1, true)
      p5.stroke(p5.color(`hsba(${hue}, ${sat}%, 100%, ${alpha})`))
      p5.point(position.x, position.y)
    }
  }
  return { update }
}

const mover = (p5, { initialPosition, isPusher, maxDistance }) => {
  let position = initialPosition.copy()
  let velocity = new Vector(0, 0)
  let target = Vector.random2D()
  const minVelocity = p5.map(maxDistance, 40, 120, 5, 10, true)
  const getVelocityLimit = generateOscillatingNumber({
    increment: 0.1,
    min: minVelocity,
    max: minVelocity * 2,
    initialValue: minVelocity,
  })

  let maxVelocity = 4
  const selectNewTarget = () => {
    maxVelocity = getVelocityLimit()
    target.rotate(p5.random(p5.PI / 3, p5.PI / 2))
    target.setMag(10000)
  }
  selectNewTarget()
  const isOutOfBounds = () => {
    const { x, y } = position
    return x > p5.width || y > p5.height || x < 0 || y < 0
  }

  const isAtTarget = () => {
    return distanceSquared(position, target) < 1
  }

  const update = () => {
    if (isAtTarget() || isOutOfBounds()) {
      selectNewTarget()
    }

    let acceleration = Vector.sub(target, position)
    velocity.add(acceleration)
    velocity.limit(maxVelocity)
    position.add(velocity)
  }
  return { update, position, isPusher }
}

const getClosestVector = (position, vectors = []) => {
  return vectors
    .map((v) => ({ distance: distanceSquared(v.position, position), v }))
    .sort((a, b) => a.distance - b.distance)[0].v
}

export default () => <P5Wrapper sketch={sketch} />

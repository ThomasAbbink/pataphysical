import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { Vector } from 'p5'
import { generateOscillatingNumber } from '../../../utility/numbers'

const sketch = (p5) => {
  let backgroundColor = p5.color(100, 130, 150)
  const gridPoints = []
  const movers = []

  p5.setup = () => {
    const { width, height } = getCanvasSize()

    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    p5.frameRate(30)
    gridPoints.push(dot(p5, { position: p5.createVector(0, 0) }))
    createMover()

    for (let i = 0; i < p5.width; i += p5.width / 70) {
      for (let j = 0; j < p5.height; j += p5.height / 70) {
        const position = p5.createVector(i, j)
        gridPoints.push(dot(p5, { position }))
      }
    }
  }

  const createMover = (isPusher = p5.random([true, false])) => {
    movers.push(
      mover(p5, {
        initialPosition: p5.createVector(p5.width / 2, p5.height / 2),
        isPusher: true,
      }),
    )
  }

  const removeMover = () => {
    movers.pop()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
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

    p5.strokeWeight(4)
    if (p5.frameCount % 500 === 0) {
      createMover()
      if (movers.length > 2) {
        removeMover()
        removeMover()
      }
    }
    const maxDistance = p5.width / 7
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
    return position.dist(target) < 10
  }

  const update = ({ movers = [], maxDistance, hue }) => {
    const closestMover = getClosestVector(position, movers)
    const distanceFromMover = initialPosition.dist(closestMover.position)
    const distanceFromCenter = initialPosition.dist(
      p5.createVector(p5.width / 2, p5.height / 2),
    )
    const sat = p5.map(distanceFromCenter, 0, p5.width / 2, 1, 100, true)

    const target =
      distanceFromMover <= maxDistance ? closestMover.position : initialPosition

    if (!isAtTarget(target)) {
      let acceleration = Vector.sub(target, position)
      velocity.add(acceleration)
      if (closestMover.isPusher && !target.equals(initialPosition)) {
        velocity.limit(
          p5.map(position.dist(target), 0, maxDistance, 6, 1, true),
        )
        velocity.rotate(p5.PI)
      } else {
        velocity.limit(
          p5.map(position.dist(target), 0, maxDistance, 1, 0.1, true),
        )
      }
      position.add(velocity)
      const alpha = p5.map(distanceFromMover, 0, maxDistance, 1, 0.1, true)
      p5.stroke(p5.color(`hsba(${hue}, ${sat}%, 100%, ${alpha})`))
      p5.point(position.x, position.y)
    }
  }
  return { update }
}

const mover = (p5, { initialPosition, isPusher }) => {
  let position = initialPosition.copy()
  let velocity = new Vector(0, 0)
  let target = Vector.random2D()

  const getVelocityLimit = generateOscillatingNumber({
    increment: 0.1,
    min: 5,
    max: 10,
    initialValue: 5,
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
    return position.dist(target) < 1
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
    .map((v) => ({ distance: v.position.dist(position), v }))
    .sort((a, b) => a.distance - b.distance)[0].v
}

export default () => <P5Wrapper sketch={sketch} />

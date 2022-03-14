import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { generateOscillatingNumber } from '../../../utility/numbers'
import { P5Wrapper } from '../../P5Wrapper'

const sketch = (p5) => {
  let backgroundColor = p5.color(122, 177, 222)
  const circles = new Map()
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    p5.colorMode(p5.HSL)
  }

  const createCircle = (values) => {
    const {
      translation: { x, y },
      count,
    } = values
    const id = `${x}${y}${count}`
    circles.set(id, circle(p5, { ...values, id, createCircle, destroyCircle }))
  }

  const createRipple = ({ translation, scale = 1, rippleCount = 3 }) => {
    let count = 0
    const interval = setInterval(() => {
      createCircle({ translation, scale, radius: 1, count })
      count += 1
      if (count === rippleCount) {
        clearInterval(interval)
      }
    }, 300)
  }

  const destroyCircle = (id) => {
    circles.delete(id)
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.mousePressed = () => {}

  const createCircleVectors = ({
    recursionDepth = 0,
    origin,
    magnitude = 100,
    pointsOnCircle = 3,
  }) => {
    if (recursionDepth <= 0) {
      return [origin]
    }

    const vectors = []
    for (let i = 0; i < Math.PI * 2; i += Math.PI / pointsOnCircle) {
      const v = p5.createVector(p5.cos(i), -p5.sin(i))
      v.setMag(magnitude)
      v.add(origin)
      vectors.push(v)
    }

    return vectors
      .map((v) =>
        createCircleVectors({
          magnitude,
          origin: v,
          recursionDepth: recursionDepth - 1,
        }),
      )
      .flat()
  }

  const getMagnitude = generateOscillatingNumber({
    increment: 15,
    min: 140,
    max: 200,
  })

  const scale = generateOscillatingNumber({
    increment: 0.1,
    min: 1,
    max: 2,
  })
  const getRecursionDepth = generateOscillatingNumber({
    increment: 1,
    min: 1,
    max: 3,
    initialValue: -1,
  })
  const getPointsOnCircle = generateOscillatingNumber({
    increment: 0.5,
    min: 1,
    max: 5,
  })

  const getRippleCount = generateOscillatingNumber({
    increment: 1,
    min: 1,
    max: 4,
    initialValue: 3,
  })

  let hasStarted = false
  let lightness = 80

  let circleHue = generateOscillatingNumber({
    increment: 0.1,
    min: 0,
    max: 360,
    initialValue: p5.random(0, 360),
  })
  let backgroundHue = generateOscillatingNumber({
    increment: 0.01,
    min: 0,
    max: 360,
    initialValue: p5.random(0, 360),
  })
  let sat = generateOscillatingNumber({
    increment: 0.01,
    min: 30,
    max: 80,
    initialValue: p5.random(30, 80),
  })
  let allDifferent = false
  p5.draw = () => {
    const targetLightNess = p5.map(circles.size, 0, 150, 90, 5, true)
    if (targetLightNess > lightness) {
      lightness += 0.5
    } else if (targetLightNess < lightness) {
      lightness -= 0.5
    }
    p5.background(p5.color(backgroundHue(), sat(), lightness))

    if (p5.frameCount % 3000 === 0) {
      allDifferent = !allDifferent
    }
    if (!hasStarted || p5.frameCount % 360 === 0) {
      hasStarted = true
      const recursionDepth = getRecursionDepth()
      const count = getRippleCount()
      const magnitude = getMagnitude()
      const s = scale()
      createCircleVectors({
        magnitude: allDifferent ? getMagnitude() : magnitude,
        recursionDepth: allDifferent ? getRecursionDepth() : recursionDepth,
        origin: p5.createVector(p5.width / 2, p5.height / 2),
        pointsOnCircle: getPointsOnCircle(),
      }).forEach((v) => {
        createRipple({
          translation: v,
          scale: allDifferent ? scale() : s,
          rippleCount:
            recursionDepth < 3 ? (allDifferent ? getRippleCount() : count) : 1,
        })
      })
    }
    const circleColor = p5.color(
      circleHue(),
      100,
      p5.map(lightness, 5, 90, 100, 60, true),
    )
    for (const c of circles) {
      c[1].draw({ stroke: circleColor })
    }
  }
}

const circle = (p5, props) => {
  let {
    radius = 200,
    id,
    destroyCircle,
    translation = { x: 0, y: 0 },
    scale = 1,
  } = props

  let scaledRadius = scale * radius

  let strokeWeight = scale * 2

  const fade = () => {
    strokeWeight -= 0.01
    if (strokeWeight < 0) {
      destroyCircle(id)
    }
  }

  const updateSize = () => {
    scaledRadius += scale
  }

  const update = () => {
    updateSize()
    fade()
  }

  return {
    draw: (props) => {
      const { stroke = 255 } = props
      p5.push()
      p5.noFill()
      p5.stroke(stroke)
      p5.strokeWeight(strokeWeight)
      p5.stroke(stroke)
      p5.ellipse(translation.x, translation.y, scaledRadius, scaledRadius)
      p5.pop()
      update()
    },
  }
}

export default () => <P5Wrapper sketch={sketch} />

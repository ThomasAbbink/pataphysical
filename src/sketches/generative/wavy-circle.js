import { getCanvasSize } from '../../utility/canvas'
import {
  generateLoopNumber,
  generateOscillatingNumber,
} from '../../utility/numbers'

let backgroundColor = 255

export const wavyCircle = (p5) => {
  let c
  let circleSize

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.colorMode(p5.HSB)
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    circleSize = p5.width > p5.height ? p5.height / 2 - 20 : p5.width / 2 - 20

    c = circle({ p5, position: p5.createVector(0, 0), size: circleSize })
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const getRadialGradient = generateOscillatingNumber({
    min: 0,
    max: 0.3,
    easing: p5.random(0.005, 0.01),
    restFrames: p5.random(0, 1000),
  })

  const getRadialGradient2 = generateOscillatingNumber({
    min: 0,
    max: 0.7,
    easing: p5.random(0.005, 0.01),
    restFrames: p5.random(0, 1000),
  })

  const getBackgroundOpacity = generateOscillatingNumber({
    min: 10,
    max: 50,
    easing: 0.01,

    initialValue: 5,
  })

  const getBackgroundHue = generateLoopNumber({
    min: 0,
    max: 360,
    increment: 0.1,
    initialValue: p5.random(0, 360),
  })

  const getBackgroundSaturation = generateOscillatingNumber({
    min: 50,
    max: 90,
    increment: 0.1,
    initialValue: p5.random(20, 80),
  })

  const getBackgroundBrightness = generateOscillatingNumber({
    min: 20,
    max: 40,
    increment: 0.1,
    initialValue: p5.random(20, 40),
  })

  const getGradientHue = generateLoopNumber({
    min: 0,
    max: 360,
    increment: 0.1,
    initialValue: p5.random(0, 360),
  })

  const getGradientSaturation = generateOscillatingNumber({
    min: 10,
    max: 60,
    increment: 0.1,
    initialValue: p5.random(20, 100),
  })

  const getGradientBrightness = generateOscillatingNumber({
    min: 10,
    max: 70,
    increment: 0.01,
    initialValue: p5.random(10, 70),
    restFrames: 1000,
  })

  p5.draw = () => {
    p5.translate(p5.width / 2, p5.height / 2)
    const backgroundOpacity = getBackgroundOpacity() / 100
    const gradient = p5.drawingContext.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      circleSize * 1.5,
    )

    let c1 = p5.color(
      getBackgroundHue(),
      getBackgroundSaturation(),
      getBackgroundBrightness(),
      backgroundOpacity,
    )
    let c2 = p5.color(
      getGradientHue(),
      getGradientSaturation(),
      getGradientBrightness(),
      backgroundOpacity,
    )
    gradient.addColorStop(0, c1.toString())

    gradient.addColorStop(getRadialGradient(), c2.toString())
    gradient.addColorStop(getRadialGradient2(), c2.toString())

    gradient.addColorStop(1, c1.toString())
    p5.drawingContext.fillStyle = gradient

    c.draw()
    p5.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height)
  }
}

const circle = ({ p5, position, size }) => {
  const gapRadius = size / 10
  let maxRotationSpeed = 3
  const getStrokeWeight = generateOscillatingNumber({
    min: 0.5,
    max: 3,
    easing: 0.001,
    restFrames: 500,
  })

  const rotationSpeed = generateOscillatingNumber({
    min: -maxRotationSpeed,
    max: maxRotationSpeed,
    easing: 0.001,
    initialValue: 0,
  })

  const getBounciness = generateOscillatingNumber({
    min: 3,
    max: 10,
    easing: 0.01,
    restFrames: 300,
  })

  const getGapRadius = generateOscillatingNumber({
    min: 0,
    max: gapRadius,
    easing: 0.001,
    restFrames: 400,
    initialValue: gapRadius - 10,
  })
  let rotation = 0

  const getLineCount = generateOscillatingNumber({
    min: 12,
    max: 66,
    easing: 0.1,
    restFrames: 1000,
  })
  const draw = () => {
    const lineCount = getLineCount()
    const gapRadius = getGapRadius()
    p5.push()
    p5.translate(position.x, position.y)
    const speed = rotationSpeed()
    rotation += rotationSpeed() / 100
    p5.rotate(rotation)

    p5.noFill()
    const bounciness = getBounciness()

    p5.strokeWeight(getStrokeWeight())

    p5.stroke(255)
    p5.ellipse(0, 0, gapRadius * 2, gapRadius * 2)

    for (let i = 0; i < Math.floor(lineCount); i++) {
      // v1 is on the outer circle
      const v = p5.createVector(0, 1)
      // v2 is in the center
      const v2 = p5.createVector(0, 1)

      v.rotate((p5.TWO_PI / lineCount) * i - (p5.TWO_PI / 100) * speed)
      v2.rotate((p5.TWO_PI / lineCount) * i + (p5.TWO_PI / 10) * speed)

      v.setMag(size)
      v2.setMag(gapRadius)

      const pull1 = p5.createVector(0, 1)
      const pull2 = p5.createVector(0, 1)

      pull1.rotate(
        (p5.TWO_PI / lineCount) * i + (p5.TWO_PI / 100) * speed * bounciness,
      )
      pull2.rotate(
        (p5.TWO_PI / lineCount) * i +
          (p5.TWO_PI / 30) * speed * (bounciness * 0.5),
      )
      pull1.setMag(size - gapRadius)
      pull2.setMag(size / 4)

      p5.bezier(v.x, v.y, pull1.x, pull1.y, pull2.x, pull2.y, v2.x, v2.y)
    }
    p5.pop()
  }

  return { draw }
}

wavyCircle.date = '2022-05-25'

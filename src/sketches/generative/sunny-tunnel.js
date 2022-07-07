import { getCanvasSize } from '../../utility/canvas'
import { generateOscillatingNumber } from '../../utility/numbers'
import { destroyableMap } from '../../utility/destroyableSet'

export const sunnyTunnel = (p5) => {
  const { create, items: balls } = destroyableMap()
  let backgroundColor
  let ballCount = 20
  let isFlipped = false
  let getSize = () => {}
  let rotation = 0

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.colorMode(p5.HSB)
    backgroundColor = p5.color(195, 0, 100)
    p5.createCanvas(width, height, p5.WEBGL)
    p5.background(backgroundColor)
    p5.noStroke()
    p5.smooth()
    getSize = generateOscillatingNumber({
      min: p5.map(p5.width, 400, 1200, 10, 20, true),
      max: p5.map(p5.width, 400, 1200, 18, 35, true),
      easing: 0.001,
      restFrames: 300,
    })
    ballCount = Math.floor(p5.map(p5.width, 400, 1200, 18, 30, true))
  }

  const addRing = (mag = 10) => {
    for (let j = 0; j < ballCount; j++) {
      const p = p5.createVector(0, 1)
      p.setMag(mag)
      p.rotate(p5.TWO_PI / (ballCount / j))
      create(ball(p5, { position: p, isFlipped }))
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const rotationSpeed = generateOscillatingNumber({
    min: -0.03,
    max: 0.03,
    easing: 0.001,
    initialValue: 0,
    restFrames: 50,
  })

  const getSaturation = generateOscillatingNumber({
    min: 0,
    max: 50,
    increment: 0.01,
    initialValue: 50,
  })

  p5.draw = () => {
    const maxSize = getSize()
    const magIncrement = 0.03

    if (p5.frameCount % 20 === 0) {
      addRing()
    }

    rotation += rotationSpeed()
    const saturation = getSaturation()

    p5.background(p5.color(195, saturation, 100))
    balls.forEach((ball) => {
      ball.draw({ rotation, magIncrement, maxSize })
    })
  }
}

const ball =
  (p5, { position }) =>
  ({ destroy, id }) => {
    const maxZ = 1000
    let size = 0
    const p = position.copy()

    const draw = ({ rotation, magIncrement, maxSize }) => {
      p5.push()

      const mag = p.mag()
      const magNormal = p5.map(mag, 0, p5.width / 4, 0, 1, true)

      p.setMag(mag + (magIncrement * p5.width) / 100)
      const z = maxZ * magNormal

      // slower rotation at higher mag
      p5.rotate(rotation * (1 - magNormal))

      p5.fill(
        p5.map(magNormal, 0, 0.8, 90, 0, true),
        p5.map(magNormal, 0, 0.8, 60, 100, true),
        p5.map(magNormal, 0, 0.8, 100, 50, true),
      )
      p5.translate(p.x, p.y, z)
      if (size < maxSize * magNormal) {
        size += 0.04
      }
      if (size > maxSize * magNormal) {
        size -= 0.04
      }
      p5.sphere(size)
      p5.pop()

      if (magNormal >= 1) {
        destroy(id)
      }
    }
    return { draw }
  }

sunnyTunnel.date = '2022-06-22'

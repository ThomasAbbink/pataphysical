import { getCanvasSize } from '../../../utility/canvas'
import vert from './shader.vert'
import frag from './shader.frag'
import { generateOscillatingNumber } from '../../../utility/numbers'

const shaderHoles = (p5) => {
  let shader
  let width
  let height
  const balls = []

  p5.setup = () => {
    p5.pixelDensity(1)
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.createCanvas(width, height, p5.WEBGL)
    shader = p5.createShader(vert, frag)
    balls.push(
      ball({
        p5,
        rotation: 0.01,
        magnitude: p5.width * 0.3,
        position: p5.createVector(p5.width / 2, p5.height / 2),
      }),
    )
    balls.push(
      ball({
        p5,
        rotation: 0.01,
        magnitude: p5.width * 0.3,
        position: p5.createVector(-p5.width / 2, -p5.height / 2),
      }),
    )
  }

  p5.windowResized = () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.resizeCanvas(width, height)
  }

  const getFactor = generateOscillatingNumber({
    min: 10,
    max: 20,
    increment: 0.01,
  })

  const getWildFactor = generateOscillatingNumber({
    min: -5,
    max: 200,
    increment: 0.11,
    restFrames: 400,
    initialValue: 0,
  })

  const getFlurbSize = generateOscillatingNumber({
    min: 0.01,
    max: 0.5,
    easing: 0.002,
    restFrames: 400,
  })

  const getR = generateOscillatingNumber({
    min: 0.0,
    max: 0.6,
    increment: p5.random(0.0001, 0.0005),
    initialValue: p5.random(0, 0.6),
  })

  const getG = generateOscillatingNumber({
    min: 0.0,
    max: 0.6,
    increment: p5.random(0.0001, 0.0005),
    initialValue: p5.random(0, 0.6),
  })

  const getB = generateOscillatingNumber({
    min: 0.0,
    max: 0.6,
    increment: p5.random(0.0001, 0.0005),
    initialValue: p5.random(0, 0.6),
  })

  p5.draw = () => {
    balls.forEach((b) => {
      b.update()
    })

    const vec = balls
      .map((b) => {
        return vectorToPercent({
          vector: b.position,
          width: p5.width,
          height: p5.height,
          p5,
        })
      })
      .flat()

    shader.setUniform('resolution', [width, height])
    shader.setUniform('factor', getFactor() + getWildFactor())
    shader.setUniform('flurb_size', getFlurbSize())
    shader.setUniform('r', getR())
    shader.setUniform('g', getG())
    shader.setUniform('b', getB())
    shader.setUniform('balls', vec)

    p5.shader(shader)
    p5.rect(0, 0, width, height)
  }
}

const ball = ({
  p5,
  rotation = 0.01,
  magnitude = p5.width / 3,
  position = p5.createVector(p5.width / 2, p5.height / 2),
}) => {
  position.setMag(magnitude)

  const update = () => {
    position.rotate(rotation)
  }

  const draw = () => {
    p5.ellipse(position.x, position.y, 10, 10)
  }
  return { update, position, draw }
}

const vectorToPercent = ({ vector, width, height, p5 }) => {
  const x = p5.map(vector.x, 0, width, 0, 1) + 0.5
  const y = p5.map(vector.y, 0, height, 0, 1) + 0.5
  return [x, y]
}

shaderHoles.date = '2022-07-15'
export { shaderHoles }

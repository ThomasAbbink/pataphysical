import { getCanvasSize } from '../../utility/canvas'
import { backgroundColor } from '../../style/colors'
import { generateOscillatingNumber } from '../../utility/numbers'

const paddingHorizontal = 100
const doodle = (p5) => {
  let controlTop
  let controlBottom
  const lines = []
  let w = 2
  let h = 3
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    const availableHeight = height - paddingHorizontal * 2
    const controlDistanceFromPoint = availableHeight / 4
    w = width / 200
    h = height / 400
    controlTop = p5.createVector(
      p5.width / 2,
      paddingHorizontal + controlDistanceFromPoint,
    )
    controlBottom = p5.createVector(
      p5.width / 2,
      height - paddingHorizontal - controlDistanceFromPoint,
    )

    lines.push(line(p5)({ x: p5.width / 2, controlTop, controlBottom }))
    lines.push(
      line(p5)({
        x: p5.width / 2,
        controlTop,
        controlBottom,
        isInverted: true,
      }),
    )
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    w = width / 100
    h = height / 200
    p5.resizeCanvas(width, height)
  }

  const getTopControlVelocity = generateOscillatingNumber({
    initialValue: 0,
    min: -3,
    max: 3,
    increment: 0.05,
  })
  const getTopControlYVelocity = generateOscillatingNumber({
    initialValue: 0,
    min: -2,
    max: 2,
    increment: 0.03,
  })
  const getBottomControlVelocity = generateOscillatingNumber({
    initialValue: 1,
    min: -1.5,
    max: 1.5,
    increment: 0.02,
  })
  const getBottomControlYVelocity = generateOscillatingNumber({
    initialValue: 1,
    min: -2,
    max: 2,
    increment: 0.03,
  })
  const backgroundOpacity = generateOscillatingNumber({
    min: 1,
    max: 20,
    initialValue: 1,
    restFrames: 300,
    increment: 0.1,
  })

  p5.draw = () => {
    p5.noFill()
    p5.background(0, 0, 0, backgroundOpacity())
    p5.stroke(230, 230, 250, 200)

    controlTop.x += getTopControlVelocity() * w
    controlTop.y += getTopControlYVelocity() * h
    controlBottom.x += getBottomControlVelocity() * w
    controlBottom.y += getBottomControlYVelocity() * h

    p5.strokeWeight(3)
    lines.forEach((line) => {
      line.draw()
    })
  }
}

const line =
  (p5) =>
  ({ x, controlTop, controlBottom, isInverted }) => {
    const draw = () => {
      const top = p5.createVector(x, paddingHorizontal)

      const bottom = p5.createVector(x, p5.height - paddingHorizontal)
      p5.bezier(
        isInverted ? p5.map(top.x, 0, p5.width, p5.width, 0) : top.x,
        top.y,
        isInverted
          ? p5.map(controlTop.x, 0, p5.width, p5.width, 0)
          : controlTop.x,
        controlTop.y,
        isInverted
          ? p5.map(controlBottom.x, 0, p5.width, p5.width, 0)
          : controlBottom.x,
        controlBottom.y,
        isInverted ? p5.map(bottom.x, 0, p5.width, p5.width, 0) : bottom.x,
        bottom.y,
      )
      // p5.push()
      // p5.fill(255)
      // p5.noStroke()
      // p5.ellipse(controlTop.x, controlTop.y, 10, 10)
      // p5.ellipse(controlBottom.x, controlBottom.y, 10, 10)
      // p5.pop()
    }

    return { draw }
  }

doodle.date = '2023-07-05'
export { doodle }

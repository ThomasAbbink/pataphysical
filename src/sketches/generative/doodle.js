import { getCanvasSize } from '../../utility/canvas'
import { generateOscillatingNumber } from '../../utility/numbers'

const paddingHorizontal = 100
const doodle = (p5) => {
  let controlTop
  let controlBottom
  const lines = []
  let w = 2
  let h = 3
  let top, bottom
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.translate(p5.width / 2, p5.height / 2)
    const availableHeight = height - paddingHorizontal * 2
    const controlDistanceFromPoint = availableHeight / 4
    w = width / 200
    h = height / 400

    top = p5.createVector(0 / 2, -(height / 2) + paddingHorizontal)

    bottom = p5.createVector(0, p5.height / 2 - paddingHorizontal)
    controlTop = p5.createVector(0, -controlDistanceFromPoint)
    controlBottom = p5.createVector(
      0,
      height / 2 - paddingHorizontal - controlDistanceFromPoint,
    )

    lines.push(line(p5)({ controlTop, controlBottom, top, bottom }))
    lines.push(
      line(p5)({
        top,
        bottom,
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
    min: -1.5,
    max: 1.5,
    increment: 0.03,
  })
  const backgroundOpacity = generateOscillatingNumber({
    min: 5,
    max: 20,
    initialValue: 1,
    restFrames: 300,
    increment: 0.1,
  })

  const fillOpacity = generateOscillatingNumber({
    min: 0,
    max: 20,
    easing: 0.01,
    restFrames: 400,
    initialValue: 10,
  })

  let rotation = 0.003
  p5.draw = () => {
    p5.translate(p5.width / 2, p5.height / 2)

    p5.fill(180, 180, 230, fillOpacity())
    p5.background(0, 0, 0, backgroundOpacity())
    p5.stroke(230, 230, 250)
    p5.push()
    top.rotate(rotation)
    bottom.rotate(rotation)
    p5.pop()
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
  ({ controlTop, controlBottom, isInverted, top, bottom }) => {
    const draw = () => {
      p5.bezier(
        top.x,
        top.y,
        isInverted
          ? p5.map(
              controlTop.x,
              -p5.width / 2,
              p5.width / 2,
              p5.width / 2,
              -p5.width / 2,
            )
          : controlTop.x,
        controlTop.y,
        isInverted
          ? p5.map(
              controlBottom.x,
              -p5.width / 2,
              p5.width / 2,
              p5.width / 2,
              -p5.width / 2,
            )
          : controlBottom.x,
        controlBottom.y,
        bottom.x,
        bottom.y,
      )
    }

    return { draw }
  }

doodle.date = '2023-07-05'
export { doodle }

import { getCanvasSize } from '../../utility/canvas'
import { backgroundColor } from '../../style/colors'
import { generateOscillatingNumber } from '../../utility/numbers'

const CIRCLE_COUNT = 16

const discCircle = (p5) => {
  const circles = []
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    const smallest = width < height ? width : height
    const padding = width / 10
    const radius = (smallest - padding) / CIRCLE_COUNT

    for (let i = CIRCLE_COUNT; i > 0; i--) {
      circles.push(circle(p5)({ radius: radius * i, thickness: radius, i }))
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  let rotation = 0
  let hasOwnVelocity = true
  p5.draw = () => {
    p5.background(backgroundColor)

    p5.translate(p5.width / 2, p5.height / 2)

    rotation += 0.01

    circles.forEach(({ draw }, i) => {
      draw({ rotation, hasOwnVelocity })
    })
  }
}

const circle =
  (p5) =>
  ({ radius, thickness, i }) => {
    const getRotation = generateOscillatingNumber({
      min: 0,
      max: i / 5,
      restFrames: 100,
      easing: 0.001,
      initialValue: 1,
    })
    const draw = ({ rotation, hasOwnVelocity }) => {
      const pointOnOuterEdge = p5.createVector(0, (radius + thickness) / 2)
      const pointOnInnerEdge = p5.createVector(0, radius / 2)
      p5.push()

      p5.rotate(p5.sin(rotation + getRotation() / 2))
      const b = p5.map(i, 0, CIRCLE_COUNT, 200, 255, true)
      p5.fill(220, 220, b)
      p5.noStroke()
      p5.ellipse(0, 0, radius + thickness, radius + thickness)

      p5.stroke(backgroundColor)

      const lineCount = 40
      p5.strokeWeight(p5.map(i, 0, CIRCLE_COUNT, 2, 3, true))

      const angle = p5.TWO_PI / lineCount

      for (let j = 0; j < lineCount; j++) {
        p5.rotate(angle)

        if (i % 2 === 0) {
          const rightOuter = p5.createVector(
            pointOnOuterEdge.x,
            pointOnOuterEdge.y,
          )
          rightOuter.rotate(-(angle / 2))

          p5.line(
            pointOnInnerEdge.x,
            pointOnInnerEdge.y,
            rightOuter.x,
            rightOuter.y,
          )
          const leftOuter = p5.createVector(
            pointOnOuterEdge.x,
            pointOnOuterEdge.y,
          )
          leftOuter.rotate(angle / 2)
          p5.line(
            pointOnInnerEdge.x,
            pointOnInnerEdge.y,
            leftOuter.x,
            leftOuter.y,
          )
        } else {
          const rightInner = p5.createVector(
            pointOnInnerEdge.x,
            pointOnInnerEdge.y,
          )
          rightInner.rotate(-(angle / 2))

          p5.line(
            rightInner.x,
            rightInner.y,
            pointOnOuterEdge.x,
            pointOnOuterEdge.y,
          )
          const leftInner = p5.createVector(
            pointOnInnerEdge.x,
            pointOnInnerEdge.y,
          )
          leftInner.rotate(angle / 2)
          p5.line(
            leftInner.x,
            leftInner.y,
            pointOnOuterEdge.x,
            pointOnOuterEdge.y,
          )
        }
      }
      p5.noStroke()
      p5.fill(backgroundColor)
      p5.ellipse(0, 0, radius, radius)
      p5.pop()
    }
    return { draw }
  }

discCircle.date = '22-04-2023'
export { discCircle }

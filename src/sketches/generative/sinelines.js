import { getCanvasSize } from '../../utility/canvas'
import { backgroundColor } from '../../style/colors'
import { generateOscillatingNumber } from '../../utility/numbers'

const LINE_HEIGHT = 20

const sinelines = (p5) => {
  const lines = []
  let width, height
  let getMaxGrowth

  p5.setup = () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.createCanvas(width, height)
    p5.background(backgroundColor)

    for (let i = 0; i < p5.height; i += LINE_HEIGHT * 2) {
      lines.push(line(p5)({ y: i, isLeft: false }))
      lines.push(line(p5)({ y: i, isLeft: true }))
    }
    getMaxGrowth = generateOscillatingNumber({
      min: -width / 6,
      max: width / 6,
      increment: p5.map(p5.width, 0, 1920, 0.5, 1, true),
      initialValue: 1,
    })
  }

  p5.windowResized = () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.resizeCanvas(width, height)
  }
  const getAngleIncrement = generateOscillatingNumber({
    initialValue: 0.01,
    min: -0.05,
    max: 0.05,
    increment: 0.00001,
  })

  p5.draw = () => {
    p5.background(backgroundColor)
    const angleIncrement = getAngleIncrement()
    const maxGrowth = getMaxGrowth()
    lines.forEach((line) => {
      line.draw({ angleIncrement, maxGrowth })
    })
  }
}

const line =
  (p5) =>
  ({ y, isLeft }) => {
    const yWithOffset = isLeft ? y : y + LINE_HEIGHT
    const minWidth = p5.width / 2

    let angle = p5.map(y, 0, p5.height, p5.TWO_PI, true)

    const ownAngle = p5.map(y, 0, p5.height, 0.01, 0.02)
    const draw = ({ angleIncrement = 0.05, maxGrowth = 100 }) => {
      angle += ownAngle + angleIncrement
      let width = Math.abs(p5.sin(angle)) * maxGrowth + minWidth

      const b = p5.map(ownAngle, 0.01, 0.02, 255, 200, true)

      p5.fill(220, 220, b)
      const x = isLeft ? 0 : p5.width - width
      p5.rect(x, yWithOffset, width, LINE_HEIGHT)
    }

    return { draw }
  }

sinelines.date = '2024-04-18'
export { sinelines }

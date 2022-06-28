import { getCanvasSize } from '../../utility/canvas'

export const cardioid = (p5) => {
  let radius = 300
  let points = 200
  let factor = 0
  let isCountingUp = true
  let rate = 0.005
  const { width, height } = getCanvasSize()
  p5.setup = () => {
    p5.createCanvas(width, height)
    radius = p5.map(p5.width, 300, 1920, 150, 300, true)
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    p5.background(p5.color(33, 33, 40))
    p5.noFill()
    p5.stroke(p5.color(200, 200, 210))
    p5.translate(p5.width / 2, p5.height / 2)
    p5.ellipse(0, 0, radius * 2, radius * 2)
    for (let i = 0; i < points; i++) {
      const vector = getVector(i)
      const vector2 = getVector(i * factor)
      p5.line(vector.x, vector.y, vector2.x, vector2.y)
    }
    if (factor > 10 || factor < 0) {
      isCountingUp = !isCountingUp
    }
    isCountingUp ? (factor += rate) : (factor -= rate)
  }

  const getVector = (index) => {
    const angle = p5.map(index % points, 0, points, 0, p5.TWO_PI)
    const x = radius * p5.cos(angle)
    const y = radius * p5.sin(angle)
    return p5.createVector(x, y)
  }
}

cardioid.date = '2020-01-02'

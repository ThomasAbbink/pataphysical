import { matmul, scale } from './MatrixHelper'

import { getCanvasSize } from '../../utility/canvas'

export const cube = (p5) => {
  let xSpeed = 0.001
  let ySpeed = 0.005
  let zSpeed = 0.0
  let wSpeed = 0.005

  const xVelocity = p5.random(0, 0.01)
  const yVelocity = p5.random(0, 0.01)
  const zVelocity = p5.random(0, 0.01)
  const wVelocity = p5.random(0, 0.01)

  const points = [
    [[-0.5], [0.5], [-0.5], [-0.5]],
    [[-0.5], [-0.5], [-0.5], [-0.5]],
    [[0.5], [-0.5], [-0.5], [-0.5]],
    [[0.5], [0.5], [-0.5], [-0.5]],
    [[-0.5], [0.5], [0.5], [-0.5]],
    [[-0.5], [-0.5], [0.5], [-0.5]],
    [[0.5], [-0.5], [0.5], [-0.5]],
    [[0.5], [0.5], [0.5], [-0.5]],
    [[-0.5], [0.5], [-0.5], [0.5]],
    [[-0.5], [-0.5], [-0.5], [0.5]],
    [[0.5], [-0.5], [-0.5], [0.5]],
    [[0.5], [0.5], [-0.5], [0.5]],
    [[-0.5], [0.5], [0.5], [0.5]],
    [[-0.5], [-0.5], [0.5], [0.5]],
    [[0.5], [-0.5], [0.5], [0.5]],
    [[0.5], [0.5], [0.5], [0.5]],
  ]

  const rotationZ = (angle) => [
    [p5.cos(angle), p5.sin(angle), 0, 0],
    [p5.sin(angle), -p5.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]

  const rotationX = (angle) => [
    [1, 0, 0, 0],
    [0, p5.cos(angle), -p5.sin(angle), 0],
    [0, p5.sin(angle), p5.cos(angle), 0],
    [0, 0, 0, 1],
  ]

  const rotationY = (angle) => [
    [p5.cos(angle), 0, -p5.sin(angle), 0],
    [0, 1, 0, 0],
    [p5.sin(angle), 0, p5.cos(angle), 0],
    [0, 0, 0, 1],
  ]

  const rotationZW = (angle) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, p5.cos(angle), -p5.sin(angle)],
    [0, 0, p5.sin(angle), p5.cos(angle)],
  ]

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    p5.background(p5.color(33, 33, 40))
    p5.fill(255)
    p5.noStroke()
    p5.textSize(30)

    p5.translate(p5.windowWidth / 2, p5.windowHeight / 2)

    const projected = points.map((point) => {
      // // rotation
      let rotated = matmul(rotationZW(wSpeed), point)
      rotated = matmul(rotationX(xSpeed), rotated)
      rotated = matmul(rotationY(ySpeed), rotated)
      rotated = matmul(rotationZ(zSpeed), rotated)
      // distance
      let distance = 2

      const d = 1 / (distance - rotated[3])

      const projection = [
        [d, 0, 0, 0],
        [0, d, 0, 0],
        [0, 0, d, 0],
      ]

      // projection
      let projected2D = matmul(projection, rotated)
      projected2D = scale(projected2D, 400)
      return projected2D
    })
    drawRibs(projected)
    wSpeed += wVelocity
    xSpeed += xVelocity
    ySpeed += yVelocity
    zSpeed += zVelocity
  }

  const drawRibs = (points) => {
    // inner cube
    p5.stroke(250, 100, 50)
    for (let i = 0; i < 4; i++) {
      connect(points[(i + 1) % 4], points[i])
      connect(points[i + 4], points[((i + 1) % 4) + 4])
      connect(points[i], points[i + 4])
    }

    //outer cube
    p5.stroke(50, 100, 250)
    connect(points[8], points[9])
    connect(points[9], points[10])
    connect(points[10], points[11])
    connect(points[11], points[8])

    connect(points[12], points[13])
    connect(points[13], points[14])
    connect(points[14], points[15])
    connect(points[15], points[12])
    connect(points[8], points[12])
    connect(points[9], points[13])
    connect(points[10], points[14])
    connect(points[11], points[15])

    //connecting inner and outer
    p5.stroke(255)
    connect(points[0], points[8])
    connect(points[1], points[9])
    connect(points[2], points[10])
    connect(points[3], points[11])
    connect(points[4], points[12])
    connect(points[5], points[13])
    connect(points[6], points[14])
    connect(points[7], points[15])
  }

  const connect = (a, b) => {
    p5.strokeWeight(3)
    p5.line(a[0][0], a[1][0], b[0][0], b[1][0])
  }
}

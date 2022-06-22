import { matmul, scale } from './MatrixHelper'
import { P5Wrapper } from '../P5Wrapper'

import { getCanvasSize } from '../../utility/canvas'

const p = (p5) => {
  let xSpeed = 0.001
  let ySpeed = 0.005
  let zSpeed = 0.0
  let wSpeed = 0.005

  const xVelocity = p5.random(0, 0.01)
  const yVelocity = p5.random(0, 0.01)
  const zVelocity = p5.random(0, 0.01)
  const wVelocity = p5.random(0, 0.01)

  let xSlider
  let ySlider
  let zSlider
  let wSlider

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

  /**
   * Sliders
   */
  const sliderDividerHeight = 50
  const sliderPaddingLeft = 30
  const createSliders = () => {
    xSlider = p5.createSlider(0, 0.05, xSpeed, 0.001)
    xSlider.position(
      sliderPaddingLeft,
      p5.windowHeight - 4 * sliderDividerHeight,
    )

    ySlider = p5.createSlider(0, 0.05, ySpeed, 0.001)
    ySlider.position(
      sliderPaddingLeft,
      p5.windowHeight - 3 * sliderDividerHeight,
    )

    zSlider = p5.createSlider(0, 0.05, zSpeed, 0.001)
    zSlider.position(
      sliderPaddingLeft,
      p5.windowHeight - 2 * sliderDividerHeight,
    )

    wSlider = p5.createSlider(0, 0.05, wSpeed, 0.001)
    wSlider.position(sliderPaddingLeft, p5.windowHeight - sliderDividerHeight)
  }

  const updateSliderPosition = () => {
    xSlider.position(
      sliderPaddingLeft,
      p5.windowHeight - 4 * sliderDividerHeight,
    )
    ySlider.position(
      sliderPaddingLeft,
      p5.windowHeight - 3 * sliderDividerHeight,
    )
    zSlider.position(
      sliderPaddingLeft,
      p5.windowHeight - 2 * sliderDividerHeight,
    )
    wSlider.position(sliderPaddingLeft, p5.windowHeight - sliderDividerHeight)
  }

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
    // p.text(
    //   `x: ${xSlider.value()}`,
    //   xSlider.width + xSlider.x * 2,
    //   xSlider.y + xSlider.height / 2,
    // )
    // p.text(
    //   `y: ${ySlider.value()}`,
    //   ySlider.width + ySlider.x * 2,
    //   ySlider.y + ySlider.height / 2,
    // )
    // p.text(
    //   `z: ${zSlider.value()}`,
    //   zSlider.width + zSlider.x * 2,
    //   zSlider.y + zSlider.height / 2,
    // )
    // p.text(
    //   `w: ${wSlider.value()}`,
    //   wSlider.width + wSlider.x * 2,
    //   wSlider.y + wSlider.height / 2,
    // )
    p5.translate(
      p5.windowWidth / 2,
      p5.windowHeight / 2 - sliderDividerHeight * 2,
    )

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

export default () => <P5Wrapper sketch={p} />

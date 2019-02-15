import { matmul, scale } from './MatrixHelper'
import 'p5/lib/addons/p5.dom'
import P5Wrapper from 'react-p5-wrapper'
import React from 'react'
// import Iter from 'es-iter'

const p = p => {
  const randomStartVal = () => {
    return 0.001 * Math.floor(Math.random() * 10)
  }

  this.xSpeed = 0.0 //randomStartVal()
  this.ySpeed = 0.008 //randomStartVal()
  this.zSpeed = 0 //randomStartVal()
  this.wSpeed = 0.01 //randomStartVal()

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
    [[0.5], [0.5], [0.5], [0.5]]
  ]

  let dimensions = 2
  // const points2 = new Iter('AB').combinations(2).toArray()
  // console.log(points2)
  // const points2 = []
  // for (let i = 0; i < Math.pow(2, dimensions); i++) {
  //   const point = []
  //   for (let j = 0; j < dimensions; j++) {

  //     point.push()
  //   }
  //   points2.push(point)
  // }

  const rotationZ = angle => [
    [p.cos(angle), p.sin(angle), 0, 0],
    [p.sin(angle), -p.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]

  const rotationX = angle => [
    [1, 0, 0, 0],
    [0, p.cos(angle), -p.sin(angle), 0],
    [0, p.sin(angle), p.cos(angle), 0],
    [0, 0, 0, 1]
  ]

  const rotationY = angle => [
    [p.cos(angle), 0, -p.sin(angle), 0],
    [0, 1, 0, 0],
    [p.sin(angle), 0, p.cos(angle), 0],
    [0, 0, 0, 1]
  ]

  const rotationZW = angle => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, p.cos(angle), -p.sin(angle)],
    [0, 0, p.sin(angle), p.cos(angle)]
  ]

  /**
   * Sliders
   */
  const sliderDividerHeight = 50
  const sliderPaddingLeft = 30
  const createSliders = () => {
    this.xSlider = p.createSlider(0, 0.05, this.xSpeed, 0.001)
    this.xSlider.position(
      sliderPaddingLeft,
      p.windowHeight - 4 * sliderDividerHeight
    )

    this.ySlider = p.createSlider(0, 0.05, this.ySpeed, 0.001)
    this.ySlider.position(
      sliderPaddingLeft,
      p.windowHeight - 3 * sliderDividerHeight
    )

    this.zSlider = p.createSlider(0, 0.05, this.zSpeed, 0.001)
    this.zSlider.position(
      sliderPaddingLeft,
      p.windowHeight - 2 * sliderDividerHeight
    )

    this.wSlider = p.createSlider(0, 0.05, this.wSpeed, 0.001)
    this.wSlider.position(
      sliderPaddingLeft,
      p.windowHeight - sliderDividerHeight
    )
  }

  const updateSliderPosition = () => {
    this.xSlider.position(
      sliderPaddingLeft,
      p.windowHeight - 4 * sliderDividerHeight
    )
    this.ySlider.position(
      sliderPaddingLeft,
      p.windowHeight - 3 * sliderDividerHeight
    )
    this.zSlider.position(
      sliderPaddingLeft,
      p.windowHeight - 2 * sliderDividerHeight
    )
    this.wSlider.position(
      sliderPaddingLeft,
      p.windowHeight - sliderDividerHeight
    )
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    createSliders()
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    updateSliderPosition()
  }

  p.draw = () => {
    p.background(0)
    p.fill(255)
    p.noStroke()
    p.textSize(30)
    p.text(
      `x: ${this.xSlider.value()}`,
      this.xSlider.width + this.xSlider.x * 2,
      this.xSlider.y + this.xSlider.height / 2
    )
    p.text(
      `y: ${this.ySlider.value()}`,
      this.ySlider.width + this.ySlider.x * 2,
      this.ySlider.y + this.ySlider.height / 2
    )
    p.text(
      `z: ${this.zSlider.value()}`,
      this.zSlider.width + this.zSlider.x * 2,
      this.zSlider.y + this.zSlider.height / 2
    )
    p.text(
      `w: ${this.wSlider.value()}`,
      this.wSlider.width + this.wSlider.x * 2,
      this.wSlider.y + this.wSlider.height / 2
    )
    p.translate(p.windowWidth / 2, p.windowHeight / 2 - sliderDividerHeight * 2)

    const projected = points.map(point => {
      // // rotation
      let rotated = matmul(rotationZW(this.wSpeed), point)
      rotated = matmul(rotationX(this.xSpeed), rotated)
      rotated = matmul(rotationY(this.ySpeed), rotated)
      rotated = matmul(rotationZ(this.zSpeed), rotated)
      // distance
      let distance = 2

      const d = 1 / (distance - rotated[3])

      const projection = [[d, 0, 0, 0], [0, d, 0, 0], [0, 0, d, 0]]

      // projection
      let projected2D = matmul(projection, rotated)
      projected2D = scale(projected2D, 400)
      return projected2D
    })
    drawRibs(projected)
    this.wSpeed += this.wSlider.value()
    this.xSpeed += this.xSlider.value()
    this.ySpeed += this.ySlider.value()
    this.zSpeed += this.zSlider.value()
  }

  const drawRibs = points => {
    // inner cube
    p.stroke(250, 100, 50)
    for (let i = 0; i < 4; i++) {
      connect(
        points[(i + 1) % 4],
        points[i]
      )
      connect(
        points[i + 4],
        points[((i + 1) % 4) + 4]
      )
      connect(
        points[i],
        points[i + 4]
      )
    }

    //outer cube
    p.stroke(50, 100, 250)
    connect(
      points[8],
      points[9]
    )
    connect(
      points[9],
      points[10]
    )
    connect(
      points[10],
      points[11]
    )
    connect(
      points[11],
      points[8]
    )

    connect(
      points[12],
      points[13]
    )
    connect(
      points[13],
      points[14]
    )
    connect(
      points[14],
      points[15]
    )
    connect(
      points[15],
      points[12]
    )
    connect(
      points[8],
      points[12]
    )
    connect(
      points[9],
      points[13]
    )
    connect(
      points[10],
      points[14]
    )
    connect(
      points[11],
      points[15]
    )

    //connecting inner and outer
    p.stroke(255)
    connect(
      points[0],
      points[8]
    )
    connect(
      points[1],
      points[9]
    )
    connect(
      points[2],
      points[10]
    )
    connect(
      points[3],
      points[11]
    )
    connect(
      points[4],
      points[12]
    )
    connect(
      points[5],
      points[13]
    )
    connect(
      points[6],
      points[14]
    )
    connect(
      points[7],
      points[15]
    )
  }

  const connect = (a, b) => {
    p.strokeWeight(3)
    p.line(a[0][0], a[1][0], b[0][0], b[1][0])
  }
}

export default () => <P5Wrapper sketch={p} />

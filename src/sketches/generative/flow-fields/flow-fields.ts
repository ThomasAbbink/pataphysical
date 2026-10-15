import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5js from 'p5'

import vert from './flow-fields.vert'
import flowFrag from './flow.frag'

const flowField = (p5: p5js) => {
  let width: number
  let height: number
  let flowField: p5js.Shader
  let flowBuffer: p5js.Framebuffer

  p5.setup = () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.createCanvas(w, h, p5.WEBGL)
    p5.pixelDensity(1)
    setupShaders()
    p5.background(backgroundColor)
  }

  const setupShaders = () => {
    flowField = p5.createShader(vert, flowFrag)
    flowField.setUniform('u_resolution', [width, height])

    const fbOpts = {
      width,
      height,
      textureFiltering: p5.LINEAR,
    }

    flowBuffer = p5.createFramebuffer(fbOpts)
    flowBuffer.begin()
    p5.shader(flowField)
    p5.rect(0, 0, width, height)
    flowBuffer.end()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const drawFlowField = () => {
    flowField.setUniform('u_resolution', [width, height])
    flowField.setUniform('u_time', p5.frameCount)
    p5.shader(flowField)
    p5.noStroke()
    p5.rect(0, 0, width, height)
    flowBuffer.loadPixels()
  }

  p5.draw = () => {
    drawFlowField()
  }

  const line = () => {
    const start = p5.createVector(
      p5.random(0, p5.width),
      p5.random(0, p5.height),
    )
    const stepSize = 1
    const steps = 10

    let next = start

    p5.beginShape()

    for (let i = 0; i < steps; i++) {
      const [r, g] = flowBuffer.get(next.x, next.y)
      p5.vertex(next.x)
      p5.add

      next.add()
    }
    p5.endShape()
    const direction = p5
      .createVector(p5.random(-1, 1), p5.random(-1, 1))
      .normalize()
      .mult(stepSize)
  }
}

flowField.date = '2026-10-02'
export { flowField }

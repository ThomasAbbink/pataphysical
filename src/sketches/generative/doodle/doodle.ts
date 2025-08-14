import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5 from 'p5'

import vert from './shader.vert'
import frag from './shader.frag'

const doodle = (p5: p5) => {
  let shader: p5.Shader
  let canvas: p5.Renderer
  const { width, height } = getCanvasSize()
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    canvas = p5.createCanvas(width, height, p5.WEBGL)
    p5.background(backgroundColor)
    p5.pixelDensity(1)
    shader = p5.createShader(vert, frag)
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    shader.setUniform('u_resolution', [width, height])
    shader.setUniform('u_time', p5.frameCount)
    p5.shader(shader)
    //@ts-expect-error
    shader.setUniform('u_tex0', canvas)
    p5.rect(0, 0, width, height)
  }
}

doodle.date = '2025-2-28'
export { doodle }

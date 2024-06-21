import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5 from 'p5'
import vert from './shader.vert'
import frag from './shader.frag'
import { resolveLygia } from 'resolve-lygia'

const fbmFire = (p5: p5) => {
  let shader: p5.Shader
  const { width, height } = getCanvasSize()
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height, p5.WEBGL)
    p5.background(backgroundColor)
    shader = p5.createShader(vert, resolveLygia(frag))
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    shader.setUniform('u_resolution', [width, height])
    shader.setUniform('u_time', p5.frameCount * 0.02)
    p5.shader(shader)
    p5.rect(0, 0, width, height)
  }
}

fbmFire.date = '2024-06-20'
export { fbmFire }

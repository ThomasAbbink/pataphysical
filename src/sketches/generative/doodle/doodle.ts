import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5js from 'p5'
import jfa from './jfa.frag'
import display from './display.frag'
import vert from './shader.vert'

const doodle = (p5: p5js) => {
  let jfaShader: p5js.Shader
  let displayShader: p5js.Shader
  const { width, height } = getCanvasSize()

  const seeds: p5js.Vector[] = []
  let size = 2048
  let frameBufferA: p5js.Framebuffer
  let frameBufferB: p5js.Framebuffer
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height, p5.WEBGL)
    p5.background(backgroundColor)
    p5.pixelDensity(1)

    if (width > height) {
      size = width
    } else {
      size = height
    }

    jfaShader = p5.createShader(vert, jfa)
    displayShader = p5.createShader(vert, display)
    frameBufferA = p5.createFramebuffer({
      format: p5.FLOAT,
      textureFiltering: p5.NEAREST,
    })
    frameBufferB = p5.createFramebuffer({
      format: p5.FLOAT,
      textureFiltering: p5.NEAREST,
    })
    for (let i = 0; i < 10; i++) {
      seeds.push(
        p5.createVector(
          p5.random(0, width),
          p5.random(0, height),
          p5.random(p5.TWO_PI),
        ),
      )
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const debug = () => {
    p5.background(backgroundColor)
    p5.push()
    p5.translate(-width / 2, -height / 2)

    for (const seed of seeds) {
      p5.ellipse(seed.x, seed.y, 10)
    }
    p5.pop()
  }

  const moveSeeds = () => {
    for (const seed of seeds) {
      const speed = 2
      seed.x += Math.cos(seed.z) * speed
      seed.y += Math.sin(seed.z) * speed

      if (seed.x < 0) {
        seed.x = 0
        seed.z = Math.PI - seed.z
      } else if (seed.x > width) {
        seed.x = width
        seed.z = Math.PI - seed.z
      }

      if (seed.y < 0) {
        seed.y = 0
        seed.z = -seed.z
      } else if (seed.y > height) {
        seed.y = height
        seed.z = -seed.z
      }
    }
  }

  const drawShaders = () => {
    let buffers = [frameBufferA, frameBufferB]
    let offset = size / 2

    frameBufferA.begin()
    p5.clear()
    p5.resetShader()
    p5.push()
    p5.colorMode(p5.RGB, 1)
    p5.noStroke()
    p5.translate(-width / 2, -height / 2)
    for (const s of seeds) {
      const u = s.x / width
      const v = s.y / height
      p5.fill(u, v, 1)
      p5.rect(s.x, s.y, 1, 1)
    }

    p5.pop()
    frameBufferA.end()
    while (offset >= 0.5) {
      const [src, dest] = buffers
      dest.begin()
      p5.clear()
      jfaShader.setUniform('u_resolution', [width, height])
      jfaShader.setUniform('tex', src)
      jfaShader.setUniform('u_offset', offset)
      p5.shader(jfaShader)

      p5.rect(0, 0, width, height)

      dest.end()
      offset *= 0.5
      buffers = [dest, src]
    }

    displayShader.setUniform('u_resolution', [width, height])
    displayShader.setUniform('tex', buffers[0])

    p5.shader(displayShader)
    p5.rect(0, 0, width, height)
  }

  p5.draw = () => {
    moveSeeds()
    p5.background(backgroundColor)
    debug()
    // drawShaders()
  }
}

doodle.date = '2026-07-10'
export { doodle }

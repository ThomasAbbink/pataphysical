import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5js from 'p5'
import reactionDiffusion from './reactionDiffusion.frag'
import display from './display.frag'
import vert from './shader.vert'

const doodle = (p5: p5js) => {
  let reactionDiffusionShader: p5js.Shader
  let displayShader: p5js.Shader
  let width: number = 0
  let height: number = 0

  const SIM_SCALE = 0.33
  let simW = 0
  let simH = 0
  const STEPS = 16
  let isDissolving = false

  let seeds: p5js.Vector[] = []
  let size = 2048
  let frameBufferA: p5js.Framebuffer
  let frameBufferB: p5js.Framebuffer

  p5.setup = () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.createCanvas(w, h, p5.WEBGL)
    p5.pixelDensity(1)
    setup()
  }

  const setup = () => {
    p5.background(backgroundColor)

    if (width > height) {
      size = width
    } else {
      size = height
    }
    setupShaders()
    addSeeds(12, false, false)
  }

  p5.windowResized = () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.resizeCanvas(w, h)
    setup()
  }

  const setupShaders = () => {
    reactionDiffusionShader = p5.createShader(vert, reactionDiffusion)
    displayShader = p5.createShader(vert, display)
    simW = Math.max(1, Math.floor(width * SIM_SCALE))
    simH = Math.max(1, Math.floor(height * SIM_SCALE))
    const fbOpts = {
      width: simW,
      height: simH,
      format: p5.FLOAT,
      textureFiltering: p5.LINEAR,
    }
    frameBufferA = p5.createFramebuffer(fbOpts)
    frameBufferB = p5.createFramebuffer(fbOpts)
  }

  const addSeeds = (count: number, atCorners = false, atCenter = false) => {
    const padding = 20
    seeds = []

    if (atCorners) {
      seeds.push(p5.createVector(padding, padding))
      seeds.push(p5.createVector(simW - padding, simH - padding))
      seeds.push(p5.createVector(0, simH - padding))
      seeds.push(p5.createVector(simW - padding, 0))
    }

    if (atCenter) {
      seeds.push(p5.createVector(simW / 2, simH / 2))
    }
    // seeds.push(p5.createVector(p5.random(10), p5.random(simH)))
    // seeds.push(p5.createVector(p5.random(simW), p5.random(10)))

    for (let i = 0; i < count; i++) {
      seeds.push(
        p5.createVector(
          p5.random(simW * 0.25, simW * 0.75),
          p5.random(simH * 0.25, simH * 0.75),
        ),
      )
    }
    frameBufferA.begin()
    p5.clear()
    p5.resetShader()
    p5.push()
    p5.colorMode(p5.RGB, 1)
    p5.noStroke()
    p5.translate(-simW / 2, -simH / 2)
    p5.fill(1, 0, 0)
    p5.rect(0, 0, simW, simH)
    for (const s of seeds) {
      if (isDissolving) {
        p5.fill(1, 0, 0)
        p5.rect(s.x, s.y, 10, 10)
      } else {
        p5.fill(0, 1, 0)
        p5.rect(s.x, s.y, 10, 10)
      }
    }
    p5.pop()
    frameBufferA.end()
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

  const reset = () => {
    addSeeds(0, true, true)
  }

  const drawShaders = () => {
    let buffers = [frameBufferA, frameBufferB]
    reactionDiffusionShader.setUniform('u_resolution', [simW, simH])
    reactionDiffusionShader.setUniform('u_time', p5.frameCount)
    p5.shader(reactionDiffusionShader)
    for (let i = 0; i < STEPS; i++) {
      const [src, dest] = buffers
      dest.begin()

      reactionDiffusionShader.setUniform('tex', src)
      reactionDiffusionShader.setUniform('u_isdissolving', isDissolving)
      p5.rect(0, 0, width, height) // fullscreen NDC quad; FBO viewport is sim-sized
      dest.end()
      buffers = [dest, src]
    }
    // display at full canvas — samples small tex, stretches it
    displayShader.setUniform('u_resolution', [width, height])
    displayShader.setUniform('u_time', p5.frameCount)
    displayShader.setUniform('tex', buffers[0])
    p5.shader(displayShader)
    p5.rect(0, 0, width, height)

    // if (p5.frameCount % 1000 === 0) {
    //   isDissolving = true
    // }
    // if (p5.frameCount % 2000 === 0) {
    //   isDissolving = false
    // }
    // if (isDissolving) {
    //   addSeeds(0, true, true)
    // }
  }

  p5.draw = () => {
    // debug()
    drawShaders()

    if (isDissolving) {
    }
  }
}

doodle.date = '2026-07-24'
export { doodle }

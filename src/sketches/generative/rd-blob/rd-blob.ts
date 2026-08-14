import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5js from 'p5'
import reactionDiffusion from './reactionDiffusion.frag'
import display from './display.frag'
import vert from './shader.vert'

const rdBlob = (p5: p5js) => {
  let reactionDiffusionShader: p5js.Shader
  let displayShader: p5js.Shader
  let width: number = 0
  let height: number = 0

  const SIM_SCALE = 0.666
  let simW = 0
  let simH = 0
  const STEPS = 32
  let isDissolving = false

  let seeds: p5js.Vector[] = []
  let size = 2048
  let frameBufferA: p5js.Framebuffer
  let frameBufferB: p5js.Framebuffer
  let imageBuffer: p5js.Framebuffer
  let seed: number
  let image: p5js.Image
  let ready = false

  p5.setup = async () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.createCanvas(w, h, p5.WEBGL)
    p5.pixelDensity(1)
    seed = p5.random(0.1, 0.99)
    await setup()
  }

  const setup = async () => {
    ready = false
    p5.background(backgroundColor)

    if (width > height) {
      size = width
    } else {
      size = height
    }
    if (!image) {
      image = await p5.loadImage('/assets/walken.jpeg')
    }
    setupShaders()
    blitImage()
    addSeeds()
    ready = true
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
    imageBuffer = p5.createFramebuffer({
      width: simW,
      height: simH,
      textureFiltering: p5.LINEAR,
    })
  }

  const blitImage = () => {
    const imgAspect = image.width / image.height
    const bufAspect = simW / simH
    // Landscape photo on a portrait phone: fill the buffer and crop the sides
    // so the sim isn't stuck in a thin letterboxed strip.
    const cropToFill = imgAspect > 1 && bufAspect < 1

    let drawW: number
    let drawH: number
    if (cropToFill) {
      drawH = simH
      drawW = simH * imgAspect
    } else if (imgAspect > bufAspect) {
      drawW = simW
      drawH = simW / imgAspect
    } else {
      drawH = simH
      drawW = simH * imgAspect
    }

    imageBuffer.begin()
    p5.resetShader()
    p5.background(0)
    p5.push()
    p5.imageMode(p5.CORNER)
    p5.image(image, -drawW / 2, -drawH / 2, drawW, drawH)
    p5.pop()
    imageBuffer.end()
  }

  const addSeeds = () => {
    const padding = 20
    seeds = []

    // seeds.push(p5.createVector(p5.random(10), p5.random(simH)))
    // seeds.push(p5.createVector(p5.random(simW), p5.random(10)))

    // seeds.push(p5.createVector(simW * 0.3, padding))
    seeds.push(p5.createVector(simW * 0.5, simH * 0.5))
    // seeds.push(p5.createVector(simW * 0.7, padding))

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

  const drawShaders = () => {
    let buffers = [frameBufferA, frameBufferB]
    reactionDiffusionShader.setUniform('u_resolution', [simW, simH])
    reactionDiffusionShader.setUniform('u_time', p5.frameCount)
    reactionDiffusionShader.setUniform('u_seed', seed)
    reactionDiffusionShader.setUniform('u_image', imageBuffer)

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
    if (!ready) return
    // debug()
    drawShaders()

    if (isDissolving) {
    }
  }
}

rdBlob.date = '2026-08-10'
export { rdBlob }

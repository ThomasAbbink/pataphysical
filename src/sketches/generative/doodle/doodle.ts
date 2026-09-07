import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5js from 'p5'
import flow from './flow.frag'
import display from './display.frag'
import vert from './shader.vert'
import strokeVert from './stroke.vert'
import brushFrag from './brush.frag'
import blurFrag from './blur.frag'

// const backgroundColor = ' #FFF'
type StrokePoint = {
  anchor: p5js.Vector
  normal: p5js.Vector
  s: number
  halfWidth: number
}

type Stroke = {
  points: StrokePoint[]
  totalArc?: number
  color: p5js.Vector
  progress: number
  speed: number
}

const doodle = (p5: p5js) => {
  let flowShader: p5js.Shader
  let displayShader: p5js.Shader
  let strokeShader: p5js.Shader
  let blurShader: p5js.Shader

  let width = 0
  let height = 0

  let imageBuffer: p5js.Framebuffer
  let flowBuffer: p5js.Framebuffer
  let paintBuffer: p5js.Framebuffer
  let paintBlurBuffer: p5js.Framebuffer

  let blurBuffer: p5js.Framebuffer

  let brush: p5js.Image
  let image: p5js.Image
  let ready = false

  let flowPixels: number[]

  const MAX_STOKES = 50000
  let currentStroke = 0
  let lastRefresh = 0
  const wetStrokes: Stroke[] = []

  let radius = 20
  let lastBlurRadius = 20

  p5.setup = async () => {
    const { width: w, height: h } = getCanvasSize()
    width = w
    height = h
    p5.createCanvas(w, h, p5.WEBGL)
    p5.pixelDensity(1)
    await setup()
  }

  const setup = async () => {
    ready = false
    p5.background(backgroundColor)
    const gl = p5.drawingContext as unknown as WebGLRenderingContext
    gl.disable(gl.DEPTH_TEST)

    if (!image) {
      image = await p5.loadImage('/assets/tree_water.jpg')
    }
    if (!brush) {
      brush = await p5.loadImage('/assets/stroke.png')
    }

    setupShaders()
    blitImage()

    updateFlow(1)

    blurInto({ source: imageBuffer, destination: blurBuffer, radius: radius })
    blurInto({
      source: paintBuffer,
      destination: paintBlurBuffer,
      radius: radius,
    })

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
    flowShader = p5.createShader(vert, flow)
    displayShader = p5.createShader(vert, display)
    strokeShader = p5.createShader(strokeVert, brushFrag)
    blurShader = p5.createShader(vert, blurFrag)

    const fbOpts = {
      width,
      height,
      textureFiltering: p5.LINEAR,
    }

    imageBuffer = p5.createFramebuffer(fbOpts)
    flowBuffer = p5.createFramebuffer(fbOpts)
    paintBuffer = p5.createFramebuffer(fbOpts)

    const sampleBufferOptions = {
      width: Math.ceil(width / 4),
      height: Math.ceil(height / 4),
      textureFiltering: p5.LINEAR,
    }
    blurBuffer = p5.createFramebuffer(sampleBufferOptions)
    paintBlurBuffer = p5.createFramebuffer(sampleBufferOptions)

    paintBuffer.begin()
    p5.background(backgroundColor)
    paintBuffer.end()
  }

  const blurInto = ({
    source,
    destination,
    radius,
  }: {
    source: p5js.Framebuffer
    destination: p5js.Framebuffer
    radius: number
  }) => {
    blurShader.setUniform('u_resolution', [
      destination.width,
      destination.height,
    ])
    blurShader.setUniform('u_image', source)
    blurShader.setUniform('u_radius', radius / 4)

    destination.begin()
    p5.shader(blurShader)
    p5.noStroke()
    p5.rect(0, 0, width, height)
    destination.end()
    destination.loadPixels()
  }

  const blitImage = () => {
    const imgAspect = image.width / image.height
    const bufAspect = width / height

    let drawW: number
    let drawH: number
    if (imgAspect > bufAspect) {
      drawW = width
      drawH = width / imgAspect
    } else {
      drawH = height
      drawW = height * imgAspect
    }

    imageBuffer.begin()
    p5.resetShader()
    p5.background(0)
    p5.push()

    p5.imageMode(p5.CORNER)
    p5.image(image, -drawW / 2, -drawH / 2, drawW, drawH)
    p5.pop()
    imageBuffer.end()
    imageBuffer.loadPixels()
  }

  const updateFlow = (blur: number) => {
    flowShader.setUniform('u_resolution', [width, height])
    flowShader.setUniform('u_time', p5.frameCount)
    flowShader.setUniform('u_image', imageBuffer)
    flowShader.setUniform('u_blur', blur)
    flowShader.setUniform('u_min_strength', 0.002)

    flowBuffer.begin()
    p5.shader(flowShader)
    p5.rect(0, 0, width, height)
    flowBuffer.end()

    flowBuffer.loadPixels()
    flowPixels = flowBuffer.pixels
  }

  const sampleFlow = (x: number, y: number) => {
    const col = p5.constrain(Math.floor(x), 0, width - 1)
    const row = p5.constrain(Math.floor(y), 0, height - 1)
    const i = (row * width + col) * 4
    return {
      dir: p5.createVector(
        (flowPixels[i] / 255) * 2 - 1,
        (flowPixels[i + 1] / 255) * 2 - 1,
      ),
      strength: flowPixels[i + 2] / 255,
    }
  }

  const sampleImage = (x: number, y: number) => {
    const ew = blurBuffer.width
    const eh = blurBuffer.height
    const col = p5.constrain(Math.floor((x / width) * ew), 0, ew - 1)
    const row = p5.constrain(Math.floor((y / height) * eh), 0, eh - 1)
    const i = (row * ew + col) * 4
    const imagePixels = blurBuffer.pixels
    return p5.createVector(
      imagePixels[i],
      imagePixels[i + 1],
      imagePixels[i + 2],
    )
  }

  const buildStroke = (start: p5js.Vector, radius: number) => {
    const stepLength = radius * 0.7
    const maxPoints = p5.random(12, 32)
    const fc = p5.map(radius, 0, 26, 0.7, 0.2)
    const halfWidth = radius * p5.random(0.2, 1.2)
    const points: StrokePoint[] = []

    const speed = 0.001 * maxPoints

    let x = start.x
    let y = start.y
    const startColor = sampleImage(start.x, start.y)

    let prev = null
    let strengthSkips = 0

    for (let i = 0; i < maxPoints; i++) {
      const { dir, strength } = sampleFlow(x, y)
      let d: p5js.Vector
      if (strength < 0.02) {
        if (!prev || strengthSkips > 3) break
        d = prev.copy()
        strengthSkips++
      } else {
        strengthSkips = 0
        d = dir
        if (prev) {
          if (d.dot(prev) < 0) d.mult(-1)
          d = prev.copy().lerp(d, fc)
        }
        d.normalize()
      }

      points.push({
        anchor: p5.createVector(x, y),
        normal: p5.createVector(-d.y, d.x),
        s: 0,
        halfWidth,
      })
      x += d.x * stepLength
      y += d.y * stepLength
      const c = sampleImage(x, y)
      const diff =
        Math.abs(c.x - startColor.x) +
        Math.abs(c.y - startColor.y) +
        Math.abs(c.z - startColor.z)

      if (diff > 120) break

      prev = d
      if (x < 0 || x >= width || y < 0 || y >= height) {
        break
      }
    }

    if (points.length < 2) return null

    const last = points.length - 1
    points.forEach((p, i) => {
      p.s = i / last
    })
    return { points, color: startColor, progress: 0, speed }
  }

  const drawStrokeDebug = (
    stroke: Pick<Stroke, 'points'>,
    color: p5js.Vector,
  ) => {
    p5.resetShader()
    p5.noFill()
    p5.stroke(color.x, color.y, color.z)
    p5.strokeWeight(4)
    p5.beginShape()
    for (const point of stroke.points) {
      p5.vertex(point.anchor.x - width / 2, point.anchor.y - height / 2)
    }
    p5.endShape()
  }

  const drawRibbon = (stroke: Stroke) => {
    strokeShader.setUniform('u_brush', brush)
    strokeShader.setUniform('u_color', [
      stroke.color.x,
      stroke.color.y,
      stroke.color.z,
    ])
    strokeShader.setUniform('u_brushCrop', 0.7)
    strokeShader.setUniform('u_brushAngle', 13.0)
    strokeShader.setUniform('u_progress', stroke.progress ?? 0.0)
    strokeShader.setUniform('u_inkLow', 0.61)
    strokeShader.setUniform('u_inkHigh', 0.9)

    p5.shader(strokeShader)
    p5.noStroke()

    p5.beginShape(p5.TRIANGLE_STRIP)
    for (const point of stroke.points) {
      const x = point.anchor.x - width / 2
      const y = point.anchor.y - height / 2
      const w = point.halfWidth

      p5.vertex(x + point.normal.x * w, y + point.normal.y * w, 0, 0, point.s)
      p5.vertex(x - point.normal.x * w, y - point.normal.y * w, 0, 1, point.s)
    }
    p5.endShape()
  }

  const drawDisplay = () => {
    displayShader.setUniform('u_resolution', [width, height])
    displayShader.setUniform('u_time', p5.frameCount)
    displayShader.setUniform('u_paint', paintBuffer)
    displayShader.setUniform('u_flow', flowBuffer)

    p5.shader(displayShader)
    p5.noStroke()
    p5.strokeWeight(0)
    p5.rect(0, 0, width, height)
  }

  const debug = () => {
    p5.resetShader()
    p5.push()
    p5.stroke(255)
    p5.strokeWeight(1)
    const step = 30
    const lenght = 10

    for (let x = 0; x < p5.width; x += step) {
      for (let y = 0; y < height; y += step) {
        const { dir, strength } = sampleFlow(x, y)
        if (strength < 0.02) {
          continue
        }
        const cx = x - width / 2
        const cy = y - height / 2

        p5.line(cx, cy, cx + dir.x * lenght, cy + dir.y * lenght)
      }
    }
    p5.pop()
  }

  const errorAt = (x: number, y: number) => {
    const ew = blurBuffer.width,
      eh = blurBuffer.height
    const col = p5.constrain(Math.floor((x / width) * ew), 0, ew - 1)
    const row = p5.constrain(Math.floor((y / height) * eh), 0, eh - 1)
    const i = (row * ew + col) * 4
    const ref = blurBuffer.pixels,
      paint = paintBlurBuffer.pixels
    return (
      Math.abs(ref[i] - paint[i]) +
      Math.abs(ref[i + 1] - paint[i + 1]) +
      Math.abs(ref[i + 2] - paint[i + 2])
    )
  }

  const pickSeed = (n = 5) => {
    let bx = 0
    let by = 0
    let best = -1
    let bestE = -1

    const t = Math.min(1, currentStroke / MAX_STOKES)
    const sd = p5.lerp(width * 0.5, width * 0.12, t)

    for (let i = 0; i < n; i++) {
      const x = p5.constrain(p5.randomGaussian(width / 2, sd), 0, width - 1)
      const y = p5.random(height)
      const e = errorAt(x, y)

      if (e > best) {
        best = e
        bx = x
        by = y
        bestE = e
      }
    }
    return { seed: p5.createVector(bx, by), error: bestE }
  }

  p5.draw = () => {
    if (!ready) return
    p5.background(backgroundColor)

    let count = 0
    let attempts = 0
    const concurrent = 50
    let maxWetStrokes = 1
    if (currentStroke > 3) {
      maxWetStrokes = 5 + (currentStroke / MAX_STOKES) * 400
    }

    const radiusMin = 1
    const radiusCeiling =
      radiusMin + 26 * Math.exp(-3 * (currentStroke / MAX_STOKES / 2))
    while (
      currentStroke <= MAX_STOKES &&
      count <= concurrent &&
      attempts < 500 &&
      wetStrokes.length < maxWetStrokes
    ) {
      attempts++
      const { seed, error } = pickSeed()
      const local = p5.constrain(error / 250, 0, 1)
      const r = p5.lerp(radiusMin, radiusCeiling, local)
      const s = buildStroke(seed, r)
      radius = r
      if (s) {
        wetStrokes.push(s)
        count++
        currentStroke++
      }
    }
    if (currentStroke - lastRefresh > 30) {
      lastRefresh = currentStroke
      blurInto({ source: paintBuffer, destination: paintBlurBuffer, radius })
      if (Math.abs(radius - lastBlurRadius) > lastBlurRadius * 0.1) {
        blurInto({ source: imageBuffer, destination: blurBuffer, radius })
        console.log('loading imagebuffer')
        lastBlurRadius = radius
      }
    }

    for (let i = wetStrokes.length - 1; i >= 0; i--) {
      wetStrokes[i].progress += wetStrokes[i].speed * 3
      if (wetStrokes[i].progress >= 1) {
        paintBuffer.begin()
        drawRibbon(wetStrokes[i])
        paintBuffer.end()
        wetStrokes.splice(i, 1)
      }
    }

    drawDisplay()
    for (const s of wetStrokes) {
      drawRibbon(s)
    }
  }
}

doodle.date = '2026-08-17'
export { doodle }

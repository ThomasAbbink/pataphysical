import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5js from 'p5'
import flow from '../painting/flow.frag'
import display from '../painting/display.frag'
import vert from '../painting/shader.vert'
import strokeVert from '../painting/stroke.vert'
import brushFrag from '../painting/brush.frag'
import blurFrag from '../painting/blur.frag'
import {
  INITIAL_STATE,
  State,
  StokeMap,
  Stroke,
  StrokePoint,
} from '../painting/painting-types'
import { Sketch } from '../../../types/Sketch'
import { PaintSourceFactory, SourceFrame } from './sources/source-types'

let MAX_STOKES = 30000
const MIN_RADIUS = 4

export type PaintingOptions = {
  source: PaintSourceFactory
  refreshBump: number
  showSource?: boolean
}

export const makePainting = (
  name: string,
  date: string,
  { source: createSource, refreshBump, showSource = false }: PaintingOptions,
): Sketch => {
  const sketch = (p5: p5js) => {
    let flowShader: p5js.Shader
    let displayShader: p5js.Shader
    let strokeShader: p5js.Shader
    let blurShader: p5js.Shader

    let width = 0
    let height = 0
    let maxRadius = 20

    let imageBuffer: p5js.Framebuffer
    let flowBuffer: p5js.Framebuffer
    let paintBuffer: p5js.Framebuffer
    let paintBlurBuffer: p5js.Framebuffer

    let blurBuffer: p5js.Framebuffer

    let brush: p5js.Image
    // CPU-side copy of the latest source frame, so p5 can upload it
    let frameImage: p5js.Image | null = null
    let state: State = INITIAL_STATE
    let flowPixels: number[]
    const wetStrokes: Stroke[] = []
    let strokeMap: StokeMap
    let ready = false

    const source = createSource()
    let sourceVersion = 0
    let sourceDisplay: HTMLDivElement | undefined
    let splitRow: HTMLDivElement | undefined
    let removed = false

    p5.setup = async () => {
      const { width: w, height: h } = getCanvasSize()
      width = showSource ? Math.floor(w / 2) : w
      height = h
      p5.createCanvas(width, height, p5.WEBGL)
      p5.pixelDensity(1)

      if (showSource) {
        // Own flex row, so the split doesn't depend on the wrapper's layout
        // (the carousel wrapper is a plain block)
        const canvas = p5.drawingContext.canvas as HTMLCanvasElement
        splitRow = document.createElement('div')
        splitRow.style.display = 'flex'
        sourceDisplay = document.createElement('div')
        Object.assign(sourceDisplay.style, {
          width: `${w - width}px`,
          height: `${height}px`,
          flexShrink: '0',
          overflow: 'hidden',
        })
        canvas.parentElement?.insertBefore(splitRow, canvas)
        splitRow.append(sourceDisplay, canvas)
      }
      maxRadius = (p5.width + p5.height) / 80

      const gl = p5.drawingContext as unknown as WebGLRenderingContext
      gl.disable(gl.DEPTH_TEST)

      setupShaders()
      brush = await p5.loadImage('/assets/brush-strokes/brush-strokes.png')
      strokeMap = (await p5.loadJSON(
        '/assets/brush-strokes/brush-stroke-map.json',
      )) as unknown as StokeMap

      // Removed while loading (e.g. scrolled past in the carousel)
      if (removed) return
      await source.start({ width, height }, sourceDisplay)
    }

    const remove = p5.remove.bind(p5)
    p5.remove = () => {
      removed = true
      source.remove()
      remove()
      splitRow?.remove()
    }

    p5.windowResized = () => {
      const { width: w, height: h } = getCanvasSize()
      width = showSource ? Math.floor(w / 2) : w
      height = h
      p5.resizeCanvas(width, height)
      if (sourceDisplay) {
        sourceDisplay.style.width = `${w - width}px`
        sourceDisplay.style.height = `${height}px`
      }
      //TODO resize buffers and the source
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

    // Brush size for a point in the coarse-to-fine schedule
    const radiusAt = (currentStroke: number) => {
      const t = currentStroke / MAX_STOKES
      const radiusMin = MIN_RADIUS + maxRadius * 0.1 * Math.exp(-4 * t)
      return radiusMin + maxRadius * 0.9 * Math.exp(-32 * t)
    }

    const ingestSource = (frame: SourceFrame, isFirst: boolean) => {
      blitFrame(frame)

      if (!isFirst) {
        // TODO tune: speedModifier only ever grows during a run, scale it back
        // along with the schedule
        const keep = 1 - p5.constrain(refreshBump, 0, 1)
        const currentStroke = Math.floor(state.currentStroke * keep)
        setState({
          currentStroke,
          lastRefresh: currentStroke,
          speedModifier: Math.max(1, Math.round(state.speedModifier)),
        })
      }

      const radius = radiusAt(state.currentStroke)
      updateFlow(radius / 2)
      blurInto({
        source: imageBuffer,
        destination: blurBuffer,
        radius,
      })
      blurInto({
        source: paintBuffer,
        destination: paintBlurBuffer,
        radius,
      })
      setState({ radius, lastBlurRadius: radius })
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

    const blitFrame = (frame: SourceFrame) => {
      const frameWidth =
        frame instanceof HTMLImageElement ? frame.naturalWidth : frame.width
      const frameHeight =
        frame instanceof HTMLImageElement ? frame.naturalHeight : frame.height

      if (
        !frameImage ||
        frameImage.width !== frameWidth ||
        frameImage.height !== frameHeight
      ) {
        frameImage = p5.createImage(frameWidth, frameHeight)
      }
      const image = frameImage as p5js.Image & {
        drawingContext: CanvasRenderingContext2D
        setModified: (modified: boolean) => void
      }
      image.drawingContext.clearRect(0, 0, frameWidth, frameHeight)
      image.drawingContext.drawImage(frame, 0, 0)
      image.setModified(true)

      imageBuffer.begin()
      p5.resetShader()
      p5.background(0)
      p5.push()

      p5.imageMode(p5.CORNER)
      p5.image(
        frameImage,
        -width / 2,
        -height / 2,
        width,
        height,
        0,
        0,
        frameImage.width,
        frameImage.height,
        p5.CONTAIN,
      )
      p5.pop()
      imageBuffer.end()
    }

    const updateFlow = (blur: number) => {
      flowShader.setUniform('u_resolution', [width, height])
      flowShader.setUniform('u_time', p5.frameCount)
      flowShader.setUniform('u_image', imageBuffer)
      flowShader.setUniform('u_blur', blur)
      flowShader.setUniform('u_min_strength', 0.01)

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
      const stepLength = 2 + p5.map(radius, 2, maxRadius, 0, 50)
      const maxPoints = p5.map(radius, 2, maxRadius, 6, 34)
      const fc = p5.map(radius, MIN_RADIUS, maxRadius, 0.25, 0.1, true)
      const halfWidth = radius * p5.random(0.2, 1.2)
      const points: StrokePoint[] = []

      const speed = p5.random(0.1, 0.5)

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

      const strokeMapAsset = strokeMap.strokes[Math.floor(p5.random(0, 95))]
      return { points, color: startColor, progress: 0, speed, strokeMapAsset }
    }

    const drawRibbon = (stroke: Stroke) => {
      strokeShader.setUniform('u_brush_stroke_map', brush)
      strokeShader.setUniform('u_color', [
        stroke.color.x,
        stroke.color.y,
        stroke.color.z,
      ])
      strokeShader.setUniform('u_brush_stroke_grid', [16, 6])
      strokeShader.setUniform('u_brush_stroke_tile', [
        stroke.strokeMapAsset.col,
        stroke.strokeMapAsset.row,
      ])
      strokeShader.setUniform('u_brush_stroke_box', stroke.strokeMapAsset.box)
      strokeShader.setUniform('u_brushCrop', 1.0)
      strokeShader.setUniform('u_progress', stroke.progress ?? 0.0)
      strokeShader.setUniform('u_inkLow', 0.21)
      strokeShader.setUniform('u_inkHigh', 1.0)

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

      for (let i = 0; i < n; i++) {
        const x = p5.random(width)
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

    const setState = (next: Partial<State>) => {
      state = { ...state, ...next }
    }

    const pollSource = () => {
      const version = source.version()
      if (version === sourceVersion) return
      const frame = source.frame()
      if (!frame) return

      ingestSource(frame, sourceVersion === 0)
      sourceVersion = version
      ready = true
    }

    p5.draw = () => {
      if (!brush || !strokeMap) return
      pollSource()
      if (!ready) return

      p5.background(backgroundColor)

      const nextState: State = { ...state }

      let count = 0
      let attempts = 0
      const concurrent = 500
      let maxWetStrokes = 1
      if (nextState.currentStroke > 3) {
        maxWetStrokes = 5 + (nextState.currentStroke / MAX_STOKES) * 300
      }

      const radiusCeiling = radiusAt(nextState.currentStroke)

      while (
        count <= concurrent &&
        attempts < 500 &&
        wetStrokes.length < maxWetStrokes
      ) {
        attempts++
        const { seed } = pickSeed()

        const s = buildStroke(seed, radiusCeiling)
        nextState.radius = radiusCeiling

        if (s) {
          wetStrokes.push(s)
          count++
          nextState.currentStroke++
        }
      }
      if (nextState.currentStroke - nextState.lastRefresh > 30) {
        nextState.lastRefresh = nextState.currentStroke
        blurInto({
          source: paintBuffer,
          destination: paintBlurBuffer,
          radius: nextState.radius,
        })

        if (
          Math.abs(nextState.radius - nextState.lastBlurRadius) >
          nextState.lastBlurRadius * 0.1
        ) {
          updateFlow(nextState.radius / 2)
          blurInto({
            source: imageBuffer,
            destination: blurBuffer,
            radius: nextState.radius,
          })
          nextState.lastBlurRadius = nextState.radius
          nextState.speedModifier++
        }
      }

      for (let i = wetStrokes.length - 1; i >= 0; i--) {
        wetStrokes[i].progress += wetStrokes[i].speed * nextState.speedModifier
        if (wetStrokes[i].progress >= 1) {
          paintBuffer.begin()
          drawRibbon(wetStrokes[i])
          paintBuffer.end()
          wetStrokes.splice(i, 1)
        }
      }

      setState(nextState)
      drawDisplay()
      for (const s of wetStrokes) {
        drawRibbon(s)
      }
      // Past MAX_STOKES the painting rests until the source publishes again
    }
  }

  // Carousel keys sketches by function name
  Object.defineProperty(sketch, 'name', { value: name })
  return Object.assign(sketch, { date })
}

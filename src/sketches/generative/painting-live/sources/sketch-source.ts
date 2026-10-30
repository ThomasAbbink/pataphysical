import p5js from 'p5'
import { Sketch } from '../../../../types/Sketch'
import { setCanvasSizeOverride } from '../../../../utility/canvas'
import { PaintSource, PaintSourceFactory } from './source-types'

type SketchSourceOptions = {
  //in ms
  interval: number
  scale: number
  warmupFrames?: number
}

const getCanvas = (p: p5js) => p.drawingContext.canvas as HTMLCanvasElement

export const sketchSource =
  (
    sketch: Sketch,
    { interval, scale, warmupFrames = 0 }: SketchSourceOptions,
  ): PaintSourceFactory =>
  (): PaintSource => {
    let instance: p5js | null = null
    let container: HTMLDivElement | null = null
    const output = document.createElement('canvas')
    const outputContext = output.getContext('2d')!
    let version = 0
    let lastCapture = -Infinity

    const capture = (p: p5js) => {
      if (p.frameCount < warmupFrames) return
      const now = performance.now()
      if (now - lastCapture < interval) return
      lastCapture = now

      const canvas = getCanvas(p)
      if (output.width !== canvas.width || output.height !== canvas.height) {
        output.width = canvas.width
        output.height = canvas.height
      }
      outputContext.drawImage(canvas, 0, 0)
      version++
    }
    const fitToDisplay = (p: p5js) => {
      const style = getCanvas(p).style
      style.setProperty('width', '100%', 'important')
      style.setProperty('height', '100%', 'important')
      style.setProperty('object-fit', 'contain')
    }

    return {
      start: async ({ width, height }, display) => {
        const w = Math.max(1, Math.round(width * scale))
        const h = Math.max(1, Math.round(height * scale))

        container = document.createElement('div')
        if (display) {
          Object.assign(container.style, {
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          })
          display.appendChild(container)
        } else {
          // Must stay attached and sized; display: none would break sizing
          Object.assign(container.style, {
            position: 'fixed',
            left: '-100000px',
            top: '0',
            width: `${w}px`,
            height: `${h}px`,
            pointerEvents: 'none',
          })
          document.body.appendChild(container)
        }

        instance = new p5js((p: p5js) => {
          setCanvasSizeOverride(p, { width: w, height: h })
          sketch(p)
          const draw = p.draw
          if (!draw) return
          p.draw = async () => {
            await draw()
            if (display) fitToDisplay(p)
            capture(p)
          }
        }, container)
      },
      frame: () => (version > 0 ? output : null),
      version: () => version,
      remove: () => {
        instance?.remove()
        container?.remove()
        instance = null
        container = null
      },
    }
  }

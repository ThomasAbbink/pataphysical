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

      const canvas = p.drawingContext.canvas as HTMLCanvasElement
      outputContext.drawImage(canvas, 0, 0, output.width, output.height)
      version++
    }

    return {
      start: async ({ width, height }) => {
        const w = Math.max(1, Math.round(width * scale))
        const h = Math.max(1, Math.round(height * scale))
        output.width = w
        output.height = h

        container = document.createElement('div')
        Object.assign(container.style, {
          position: 'fixed',
          left: '-100000px',
          top: '0',
          width: `${w}px`,
          height: `${h}px`,
          pointerEvents: 'none',
        })
        document.body.appendChild(container)

        instance = new p5js((p: p5js) => {
          setCanvasSizeOverride(p, { width: w, height: h })
          sketch(p)
          const draw = p.draw
          if (!draw) return
          p.draw = async () => {
            await draw()
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

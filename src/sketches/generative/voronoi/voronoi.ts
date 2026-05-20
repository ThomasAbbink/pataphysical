import p5 from 'p5'
import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'

const SITE_COUNT = 42
const EDGE_WIDTH = 1.8
const RENDER_SCALE = 3

type Site = {
  pos: p5.Vector
  color: [number, number, number]
  phase: number
}

const voronoi = (p5: p5) => {
  let sites: Site[] = []
  let layer: p5.Graphics
  let canvasWidth = 0
  let canvasHeight = 0

  const initSites = (layerWidth: number, layerHeight: number) => {
    sites = []
    p5.colorMode(p5.HSB, 360, 100, 100)
    for (let i = 0; i < SITE_COUNT; i++) {
      const hue = p5.random(360)
      const rgb = p5.color(hue, p5.random(35, 55), p5.random(78, 95))
      sites.push({
        pos: p5.createVector(
          p5.random(layerWidth),
          p5.random(layerHeight),
        ),
        color: [p5.red(rgb), p5.green(rgb), p5.blue(rgb)],
        phase: p5.random(p5.TWO_PI),
      })
    }
    p5.colorMode(p5.RGB, 255)
  }

  const renderVoronoi = () => {
    const lw = layer.width
    const lh = layer.height
    layer.loadPixels()
    const pixels = layer.pixels

    for (let y = 0; y < lh; y++) {
      for (let x = 0; x < lw; x++) {
        let minDist = Infinity
        let secondMinDist = Infinity
        let closest = 0

        for (let i = 0; i < sites.length; i++) {
          const dx = x - sites[i].pos.x
          const dy = y - sites[i].pos.y
          const dist = dx * dx + dy * dy

          if (dist < minDist) {
            secondMinDist = minDist
            minDist = dist
            closest = i
          } else if (dist < secondMinDist) {
            secondMinDist = dist
          }
        }

        const onEdge =
          Math.sqrt(secondMinDist) - Math.sqrt(minDist) < EDGE_WIDTH
        const idx = (x + y * lw) * 4

        if (onEdge) {
          pixels[idx] = 40
          pixels[idx + 1] = 40
          pixels[idx + 2] = 48
        } else {
          const [r, g, b] = sites[closest].color
          pixels[idx] = r
          pixels[idx + 1] = g
          pixels[idx + 2] = b
        }
        pixels[idx + 3] = 255
      }
    }

    layer.updatePixels()
  }

  const driftSites = () => {
    const t = p5.frameCount * 0.008
    sites.forEach((site) => {
      site.pos.x += p5.sin(t + site.phase) * 0.35
      site.pos.y += p5.cos(t * 1.1 + site.phase) * 0.35
      site.pos.x = ((site.pos.x % layer.width) + layer.width) % layer.width
      site.pos.y = ((site.pos.y % layer.height) + layer.height) % layer.height
    })
  }

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    canvasWidth = width
    canvasHeight = height
    p5.createCanvas(canvasWidth, canvasHeight)
    p5.pixelDensity(1)
    layer = p5.createGraphics(
      Math.ceil(canvasWidth / RENDER_SCALE),
      Math.ceil(canvasHeight / RENDER_SCALE),
    )
    initSites(layer.width, layer.height)
    renderVoronoi()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    canvasWidth = width
    canvasHeight = height
    p5.resizeCanvas(canvasWidth, canvasHeight)
    layer = p5.createGraphics(
      Math.ceil(canvasWidth / RENDER_SCALE),
      Math.ceil(canvasHeight / RENDER_SCALE),
    )
    initSites(layer.width, layer.height)
    renderVoronoi()
  }

  p5.draw = () => {
    driftSites()
    renderVoronoi()
    p5.background(backgroundColor)
    p5.noSmooth()
    p5.image(layer, 0, 0, canvasWidth, canvasHeight)
    p5.smooth()
  }

  p5.mousePressed = () => {
    initSites(layer.width, layer.height)
  }
}

voronoi.date = '2026-05-20'

export { voronoi }

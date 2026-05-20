import p5 from 'p5'
import { getCanvasSize } from '../../../utility/canvas'

const FIELD_RESOLUTION = 20
const PARTICLE_COUNT = 3000
const NOISE_SCALE = 0.004
const TRAIL_ALPHA = 8

const flowField = (p5: p5) => {
  let field: number[][] = []
  let cols = 0
  let rows = 0
  let particles: ReturnType<typeof createParticle>[] = []
  let zoff = 0

  const initField = () => {
    cols = Math.floor(p5.width / FIELD_RESOLUTION) + 1
    rows = Math.floor(p5.height / FIELD_RESOLUTION) + 1
    field = Array.from({ length: rows }, () => new Array(cols).fill(0))
  }

  const initParticles = () => {
    particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(p5))
  }

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.pixelDensity(1)
    p5.colorMode(p5.HSB, 360, 80, 100, 100)
    p5.strokeWeight(0.6)
    initField()
    initParticles()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
    initField()
    initParticles()
  }

  const updateField = () => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const angle =
          p5.noise(x * NOISE_SCALE, y * NOISE_SCALE, zoff) * p5.TWO_PI * 4
        field[y][x] = angle
      }
    }
    zoff += 0.002
  }

  p5.draw = () => {
    p5.colorMode(p5.RGB, 255)
    p5.background(33, 33, 40, TRAIL_ALPHA)
    p5.colorMode(p5.HSB, 360, 80, 100, 100)

    updateField()

    for (const particle of particles) {
      particle.follow(field)
      particle.edges(p5)
      particle.show(p5)
    }
  }
}

function createParticle(p5: p5) {
  const pos = p5.createVector(p5.random(p5.width), p5.random(p5.height))
  const prev = pos.copy()
  const hue = p5.random(360)
  const speed = p5.random(1.5, 3)

  return {
    follow(field: number[][]) {
      const col = Math.min(
        field[0].length - 1,
        Math.max(0, Math.floor(pos.x / FIELD_RESOLUTION)),
      )
      const row = Math.min(
        field.length - 1,
        Math.max(0, Math.floor(pos.y / FIELD_RESOLUTION)),
      )
      const angle = field[row][col]
      pos.add(p5.createVector(p5.cos(angle), p5.sin(angle)).mult(speed))
    },
    edges(p5: p5) {
      if (pos.x > p5.width || pos.y > p5.height || pos.x < 0 || pos.y < 0) {
        pos.set(p5.random(p5.width), p5.random(p5.height))
        prev.set(pos)
      }
    },
    show(p5: p5) {
      p5.stroke(hue, 55, 92, 18)
      p5.line(prev.x, prev.y, pos.x, pos.y)
      prev.set(pos)
    },
  }
}

flowField.date = '2026-05-20'

export { flowField }

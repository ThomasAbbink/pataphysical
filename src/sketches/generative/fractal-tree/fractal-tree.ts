import p5 from 'p5'
import { backgroundColor } from '../../../style/colors'
import { getCanvasSize } from '../../../utility/canvas'

const SPEED = 3
const REDRAW_DELAY = 3000
const WIND_SCALE = 3
const WIND_SPEED = 0.03

const fractalTree = (p5: p5) => {
  let branches: ReturnType<typeof branch>[] = []
  let pendingBranches = 0
  let redrawTimer: ReturnType<typeof setTimeout> | null = null
  let angleStep = 8

  const reset = () => {
    branches = []
    pendingBranches = 0
    redrawTimer = null

    const { width, height } = getCanvasSize()
    const start = p5.createVector(width / 2, height)
    angleStep = p5.random(6, 6)
    createBranches(start, -p5.HALF_PI, 1)
  }

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    reset()
  }

  const createBranches = (
    start: p5.Vector,
    angle: number,
    splitCount: number,
  ) => {
    if (splitCount > 9) return

    const baseLength = 300 / splitCount

    const maxAngleJitter = p5.radians(angleStep * 0.2)

    const leftAngleJitter = p5.map(
      p5.noise(start.x * 0.008, start.y * 0.008, angle - 1),
      0,
      1,
      -maxAngleJitter,
      maxAngleJitter,
    )
    const rightAngleJitter = p5.map(
      p5.noise(start.x * 0.008, start.y * 0.008, angle + 1),
      0,
      1,
      -maxAngleJitter,
      maxAngleJitter,
    )

    const leftAngle = angle - angleStep + leftAngleJitter
    const rightAngle = angle + angleStep + rightAngleJitter

    const leftLength =
      baseLength *
      p5.map(
        p5.noise(start.x * 0.006, start.y * 0.006, leftAngle),
        0,
        1,
        0.4,
        1.2,
      )
    const rightLength =
      baseLength *
      p5.map(
        p5.noise(start.x * 0.006, start.y * 0.006, rightAngle),
        0,
        1,
        0.4,
        1.2,
      )

    const leftEnd = p5.createVector(
      start.x + leftLength * p5.cos(leftAngle),
      start.y + leftLength * p5.sin(leftAngle),
    )
    const rightEnd = p5.createVector(
      start.x + rightLength * p5.cos(rightAngle),
      start.y + rightLength * p5.sin(rightAngle),
    )

    const onBranchComplete = (end: p5.Vector, angle: number) => {
      createBranches(end, angle, splitCount + 1)
      pendingBranches--
      if (pendingBranches === 0 && redrawTimer === null) {
        redrawTimer = setTimeout(reset, REDRAW_DELAY)
      }
    }

    pendingBranches += 2
    branches.push(
      branch({
        p5,
        start,
        end: leftEnd,
        splitCount,
        onComplete: () => onBranchComplete(leftEnd, leftAngle),
      }),
    )
    branches.push(
      branch({
        p5,
        start,
        end: rightEnd,
        splitCount,
        onComplete: () => onBranchComplete(rightEnd, rightAngle),
      }),
    )
  }

  p5.draw = () => {
    p5.background(backgroundColor)
    branches.forEach((b) => {
      b.update()
      b.draw()
    })
  }
}

function branch({
  p5,
  start,
  end,
  splitCount,
  onComplete,
}: {
  p5: p5
  start: p5.Vector
  end: p5.Vector
  splitCount: number
  onComplete: () => void
}) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.sqrt(dx * dx + dy * dy)

  // Control point: perpendicular offset at the midpoint for a gentle arc
  const perpX = -dy / len
  const perpY = dx / len
  // noise() returns [0,1], remap to [-1,1] so offset can curve either way
  const noiseVal = p5.noise(start.x * 0.005, start.y * 0.005, end.x * 0.005)
  const offset = (noiseVal - 0.5) * len * 0.5
  const control = {
    x: (start.x + end.x) / 2 + perpX * offset,
    y: (start.y + end.y) / 2 + perpY * offset,
  }

  let progress = 0
  let completed = false
  const deltaT = SPEED / len
  const SEGMENTS = 24

  function quadBezier(t: number) {
    const mt = 1 - t
    return {
      x: mt * mt * start.x + 2 * mt * t * control.x + t * t * end.x,
      y: mt * mt * start.y + 2 * mt * t * control.y + t * t * end.y,
    }
  }

  function update() {
    if (completed) return
    progress = Math.min(1, progress + deltaT)
    if (progress >= 1) {
      completed = true
      onComplete()
    }
  }

  function draw() {
    const steps = Math.max(1, Math.round(progress * SEGMENTS))
    const time = p5.frameCount * WIND_SPEED
    p5.push()
    p5.stroke(255)
    p5.strokeWeight(Math.max(1, 4 / splitCount))
    p5.noFill()
    p5.beginShape()
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * progress
      const pt = quadBezier(t)
      // depth interpolates from (splitCount-1) at the start to splitCount at the end,
      // matching the depth used by child branches at their t=0 start
      const depth = splitCount - 1 + t
      // per-point phase offset so branches don't all swing in lockstep
      const phase = p5.noise(pt.x * 0.005, pt.y * 0.005) * p5.TWO_PI
      // slowly evolving gust strength
      const gust = p5.noise(pt.x * 0.002, pt.y * 0.002, time)
      const sway =
        Math.sin(time * 2.5 + phase) * gust * Math.pow(depth, 1.2) * WIND_SCALE
      p5.vertex(pt.x + sway, pt.y)
    }
    p5.endShape()
    p5.pop()
  }

  return { update, draw }
}

fractalTree.date = '2026-04-28'

export { fractalTree }

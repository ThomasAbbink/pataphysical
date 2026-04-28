import p5 from 'p5'
import { backgroundColor } from '../../../style/colors'
import { getCanvasSize } from '../../../utility/canvas'

const SPEED = 3
const REDRAW_DELAY = 3000
const BEND_MIN = 1
const BEND_MAX = 21
const BEND_STEP = 5

let bendAmount = BEND_MIN - BEND_STEP

const fractalTree = (p5: p5) => {
  let branches: ReturnType<typeof branch>[] = []
  let pendingBranches = 0
  let redrawTimer: ReturnType<typeof setTimeout> | null = null
  let leftAngleStep = 8
  let rightAngleStep = 8

  const reset = () => {
    branches = []
    pendingBranches = 0
    redrawTimer = null
    leftAngleStep = p5.random(20, 40)
    rightAngleStep = p5.random(20, 40)
    bendAmount =
      ((bendAmount - BEND_MIN + BEND_STEP) % (BEND_MAX - BEND_MIN)) + BEND_MIN
    const { width, height } = getCanvasSize()
    const stemBase = p5.createVector(width / 2, height)
    const stemTip = p5.createVector(width / 2, height - 150)
    pendingBranches = 1
    branches.push(
      branch({
        p5,
        start: stemBase,
        end: stemTip,
        splitCount: 0,
        onComplete: () => {
          pendingBranches--
          createBranches(stemTip, -p5.HALF_PI, 1)
        },
      }),
    )
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
    if (splitCount > 10) return

    const baseLength = p5.map(
      splitCount,
      0,
      10,
      p5.random(130, 180),
      p5.random(10, 20),
    )
    const leftJitter = p5.map(
      p5.noise(start.x * 0.008, start.y * 0.008, angle - 1),
      0,
      1,
      -p5.radians(leftAngleStep * 0.2),
      p5.radians(leftAngleStep * 0.2),
    )
    const rightJitter = p5.map(
      p5.noise(start.x * 0.008, start.y * 0.008, angle + 1),
      0,
      1,
      -p5.radians(rightAngleStep * 0.2),
      p5.radians(rightAngleStep * 0.2),
    )

    const leftAngle = angle - p5.radians(leftAngleStep) + leftJitter
    const rightAngle = angle + p5.radians(rightAngleStep) + rightJitter

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

    const onBranchComplete = (end: p5.Vector, a: number) => {
      createBranches(end, a, splitCount + 1)
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
    p5.push()
    p5.stroke(255)
    p5.noFill()
    for (const b of branches) {
      b.update()
      b.draw()
    }
    p5.pop()
  }
}

type BranchPt = { x: number; y: number }

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

  const perpX = -dy / len
  const perpY = dx / len
  const noiseVal = p5.noise(start.x * 0.005, start.y * 0.005, end.x * 0.005)
  const offset = (noiseVal - 0.5) * len * bendAmount
  const cx = (start.x + end.x) / 2 + perpX * offset
  const cy = (start.y + end.y) / 2 + perpY * offset

  // More segments for thick lower branches, taper off toward tips
  const SEGMENTS = Math.max(6, 64 - splitCount * 3)
  const strokeW = splitCount === 0 ? 8 : Math.max(1, 6 / splitCount)

  // Pre-compute everything that is static for this branch's lifetime
  const pts: BranchPt[] = new Array(SEGMENTS + 1)
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS
    const mt = 1 - t
    const x = mt * mt * start.x + 2 * mt * t * cx + t * t * end.x
    const y = mt * mt * start.y + 2 * mt * t * cy + t * t * end.y
    pts[i] = { x, y }
  }

  let progress = 0
  let completed = false
  const deltaT = SPEED / len

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
    p5.strokeWeight(strokeW)
    p5.beginShape()
    for (let i = 0; i <= steps; i++) {
      const { x, y } = pts[i]
      p5.vertex(x, y)
    }
    p5.endShape()
  }

  return { update, draw }
}

fractalTree.date = '2026-04-28'

export { fractalTree }

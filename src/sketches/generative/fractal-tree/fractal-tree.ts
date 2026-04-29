import p5 from 'p5'
import { backgroundColor } from '../../../style/colors'
import { getCanvasSize } from '../../../utility/canvas'

const SPEED = 3
const REDRAW_DELAY = 3000
const BEND_MIN = 1
const BEND_MAX = 20
const BEND_STEP = 8
const MAX_CONCURRENT = 2000
let MAX_SPLIT_COUNT = 13

let bendAmount = BEND_MIN - BEND_STEP
let hueOffset = 0

const fractalTree = (p5: p5) => {
  let growingBranches: ReturnType<typeof branch>[] = []
  let growthQueue: Array<() => void> = []
  let completedLayer: p5.Graphics
  let redrawTimer: ReturnType<typeof setTimeout> | null = null
  let leftAngleStep = 8
  let rightAngleStep = 8
  let fadeAlpha = 255
  let fadingOut = false
  let canvasWidth = 0
  let canvasHeight = 0

  const drainQueue = () => {
    while (growingBranches.length < MAX_CONCURRENT && growthQueue.length > 0) {
      growthQueue.shift()!()
    }
  }

  const reset = () => {
    growingBranches = []
    growthQueue = []
    redrawTimer = null
    fadeAlpha = 255
    fadingOut = false
    MAX_SPLIT_COUNT = Math.floor(p5.random(9, 14))
    leftAngleStep = p5.random(20, 40)
    rightAngleStep = p5.random(20, 40)
    hueOffset = Math.floor(p5.random(360))
    bendAmount =
      ((bendAmount - BEND_MIN + BEND_STEP) % (BEND_MAX - BEND_MIN)) + BEND_MIN
    completedLayer.clear()
    const stemHeight = canvasHeight * p5.random(0.15, 0.25)
    const stemBase = p5.createVector(canvasWidth / 2, canvasHeight)
    const stemTip = p5.createVector(canvasWidth / 2, canvasHeight - stemHeight)
    growingBranches.push(
      branch({
        p5,
        start: stemBase,
        end: stemTip,
        splitCount: 0,
        onComplete: () => {
          createBranches(stemTip, -p5.HALF_PI, 1)
          drainQueue()
        },
      }),
    )
    p5.loop()
  }

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    canvasWidth = width
    canvasHeight = height
    p5.createCanvas(width, height)
    completedLayer = p5.createGraphics(width, height)
    p5.colorMode(p5.HSB, 360, 100, 100, 255)
    reset()
  }

  const createBranches = (
    start: p5.Vector,
    angle: number,
    splitCount: number,
  ) => {
    if (splitCount > MAX_SPLIT_COUNT) return
    const baseLength = p5.map(
      splitCount,
      0,
      MAX_SPLIT_COUNT,
      canvasHeight * p5.random(0.06, 0.14),
      canvasHeight * p5.random(0.01, 0.035),
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
      drainQueue()
    }

    growthQueue.push(() =>
      growingBranches.push(
        branch({
          p5,
          start,
          end: leftEnd,
          splitCount,
          onComplete: () => onBranchComplete(leftEnd, leftAngle),
        }),
      ),
    )
    growthQueue.push(() =>
      growingBranches.push(
        branch({
          p5,
          start,
          end: rightEnd,
          splitCount,
          onComplete: () => onBranchComplete(rightEnd, rightAngle),
        }),
      ),
    )
  }

  p5.draw = () => {
    p5.background(backgroundColor)

    if (fadingOut) {
      // Cap deltaTime to one frame to prevent the first frame after noLoop()
      // from consuming the entire elapsed sleep duration at once
      fadeAlpha -= 255 * (Math.min(p5.deltaTime, 33) / 500)
      if (fadeAlpha <= 0) {
        reset()
        return
      }
      // Use drawingContext.globalAlpha to avoid HSB colorMode tint issues
      ;(p5.drawingContext as CanvasRenderingContext2D).globalAlpha =
        Math.max(0, fadeAlpha) / 255
      p5.image(completedLayer, 0, 0)
      ;(p5.drawingContext as CanvasRenderingContext2D).globalAlpha = 1
      return
    }

    // Update, bake completed, keep growing
    const nextGrowing: ReturnType<typeof branch>[] = []
    for (const b of growingBranches) {
      b.update()
      if (b.isCompleted) {
        b.bake(completedLayer)
      } else {
        nextGrowing.push(b)
      }
    }
    growingBranches = nextGrowing

    // Fill open slots from the queue
    drainQueue()

    p5.image(completedLayer, 0, 0)

    p5.push()
    p5.noFill()
    for (const b of growingBranches) {
      b.draw()
    }
    p5.pop()

    if (growingBranches.length === 0 && growthQueue.length === 0) {
      if (redrawTimer === null) {
        redrawTimer = setTimeout(() => {
          fadingOut = true
          fadeAlpha = 255
          redrawTimer = null
          p5.loop()
        }, REDRAW_DELAY)
      }
      p5.noLoop()
    }
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

  const SEGMENTS = Math.max(3, 64 - splitCount * 3)
  const strokeW = splitCount === 0 ? 8 : Math.max(1, 6 / splitCount)

  // Rainbow: purple (stem) → blue → cyan → green → yellow → red (tips)
  const hue = (p5.map(splitCount, 0, MAX_SPLIT_COUNT, 280, 0) + hueOffset) % 360
  const sat = p5.map(splitCount, 0, MAX_SPLIT_COUNT, 0, 100)
  const branchColor = p5.color(hue, sat, 100)

  const pts: BranchPt[] = new Array(SEGMENTS + 1)
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS
    const mt = 1 - t
    pts[i] = {
      x: mt * mt * start.x + 2 * mt * t * cx + t * t * end.x,
      y: mt * mt * start.y + 2 * mt * t * cy + t * t * end.y,
    }
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
    p5.stroke(branchColor)
    p5.strokeWeight(strokeW)
    p5.beginShape()
    for (let i = 0; i <= steps; i++) {
      p5.vertex(pts[i].x, pts[i].y)
    }
    p5.endShape()
  }

  function bake(layer: p5.Graphics) {
    layer.push()
    layer.stroke(branchColor)
    layer.strokeWeight(strokeW)
    layer.noFill()
    layer.beginShape()
    for (const { x, y } of pts) {
      layer.vertex(x, y)
    }
    layer.endShape()
    layer.pop()
  }

  return {
    update,
    draw,
    bake,
    get isCompleted() {
      return completed
    },
  }
}

fractalTree.date = '2026-04-28'

export { fractalTree }

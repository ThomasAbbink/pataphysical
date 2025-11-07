import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5 from 'p5'
import input from './solver/input.txt?raw'
import { doDay, parse } from './solver/solver'
import { HexgGrid } from './solver/hexgrid'
import { Cell, solarLocations } from './solver/types'

let SEED = 'my-seed'
let cells = parse(input)
let grid: HexgGrid | null = null
let i = 0

let FRAME_INTERVAL = 10
let SHOW_LIGHT = false
let ADD_FLUORESCENCE = false

//@ts-expect-error
let speedSlider: p5.Slider
//@ts-expect-error
let seedInput: p5.Input

const fetchInput = () => {
  fetch(`https://aoc.infi.nl/api/aoc/input/2025/${SEED}`)
    .then((res) => res.text())
    .then((data) => {
      cells = parse(data)
      grid = new HexgGrid(cells)
    })
}

const onSpeedSliderChange = () => {
  console.log(speedSlider.value())
  FRAME_INTERVAL = 50 - Math.floor(speedSlider.value())
}

const aoc2025 = (p5: p5) => {
  const createLabel = (text: string, position: { x: number; y: number }) => {
    const label = p5.createP(text)
    label.position(position.x, position.y)
    label.style('font-family', 'monospace')
    label.style('font-size', '16px')
    label.style('color', 'white')
    return label
  }

  const createCheckbox = (
    text: string,
    position: { x: number; y: number },
    callback: () => void,
  ) => {
    const checkbox = p5.createCheckbox(text)
    checkbox.position(position.x, position.y)
    checkbox.style('font-family', 'monospace')
    checkbox.style('font-size', '16px')
    checkbox.style('color', 'white')
    //@ts-expect-error
    checkbox.input(callback)
    return checkbox
  }

  p5.setup = () => {
    fetchInput()
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)

    createLabel('Slow', { x: 10, y: 20 })
    createLabel('Fast', { x: 100, y: 20 })

    speedSlider = p5.createSlider(1, 49, FRAME_INTERVAL, 1)
    speedSlider.position(10, 40)
    speedSlider.input(onSpeedSliderChange)

    let showLightCheckbox = createCheckbox(
      'Show Light',
      { x: 170, y: 40 },
      () => {
        //@ts-expect-error
        SHOW_LIGHT = showLightCheckbox.checked()
      },
    )

    let addFluorescenceCheckbox = createCheckbox(
      'Add Fluorescence (part 2)',
      { x: 300, y: 40 },
      () => {
        //@ts-expect-error
        ADD_FLUORESCENCE = addFluorescenceCheckbox.checked()
      },
    )
    createLabel('Seed', { x: 600, y: 20 })

    seedInput = p5.createInput(SEED)
    seedInput.position(600, 40)
    seedInput.input(onSeedInputChange)
  }
  const onSeedInputChange = () => {
    SEED = seedInput.value()
    fetchInput()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    p5.background(backgroundColor)
    if (!grid) return
    if (p5.frameCount % FRAME_INTERVAL === 0) {
      grid.reset()
      doDay(grid, solarLocations[i % solarLocations.length], ADD_FLUORESCENCE)
      i++
    }
    for (const cell of grid.cells) {
      hexagon(p5, cell, grid)
    }
    if (p5.frameCount % FRAME_INTERVAL === 0) {
    }
  }
}

const hexagon = (p5: p5, cell: Cell, grid: HexgGrid) => {
  p5.push()
  const paddingSide = 100
  const paddingTop = 100
  const { column: x, row: y, value } = cell
  const saveViewWidth = p5.width - paddingSide * 2
  const saveViewHeight = p5.height - paddingTop * 2

  const maxCellHeight = saveViewHeight / (grid.size * 1.9)

  const cellWidth = Math.min(
    saveViewWidth / (grid.size * 3),
    maxCellHeight * 1.1547,
  )
  const cellHeight = cellWidth * 0.8660254

  const xOffset = x * 1.5 * cellWidth
  p5.translate(paddingSide + xOffset, paddingTop + cellHeight * y)

  const nullColor = [33, 33, 40]
  const fillColor = value === null ? nullColor : colorMap[value]
  for (let i = 0; i < 3; i++) {
    if (value === null && cell.color[i] > nullColor[i]) {
      cell.color[i] -= (cell.color[i] - nullColor[i]) * 0.3
    }
  }

  for (let i = 0; i < 3; i++) {
    if (cell.color[i] < fillColor[i]) {
      cell.color[i] += (fillColor[i] - cell.color[i]) * (1 / FRAME_INTERVAL)
    } else if (value !== null && cell.color[i] > fillColor[i]) {
      cell.color[i] -= (cell.color[i] - fillColor[i]) * (1 / FRAME_INTERVAL)
    }
  }

  p5.noStroke()

  p5.fill(p5.color(cell.color[0], cell.color[1], cell.color[2]))

  p5.beginShape()
  p5.scale(0.9)
  p5.vertex(-cellWidth / 2, -cellHeight)
  p5.vertex(cellWidth / 2, -cellHeight)
  p5.vertex(cellWidth, 0)
  p5.vertex(cellWidth / 2, cellHeight)
  p5.vertex(-cellWidth / 2, cellHeight)
  p5.vertex(-cellWidth, 0)
  p5.endShape(p5.CLOSE)

  if (SHOW_LIGHT && (!cell.isInShade || cell.isInLenslight)) {
    p5.fill(233, 245, 66)
    p5.ellipse(0, 0, 5, 5)
    // p5.strokeWeight(2)
    // const strokeColor =
    //    ? backgroundColor : [200, 200, 200]
    // p5.stroke(strokeColor)
  }
  p5.pop()
}

const colorMap: Record<NonNullable<Cell['value']>, number[]> = {
  0: [175, 251, 171],
  1: [115, 241, 109],
  2: [28, 174, 45],
  3: [30, 128, 26],
  4: [174, 65, 28],
  5: [180, 0, 180],
}

aoc2025.date = '2025-11-07'
export { aoc2025 }

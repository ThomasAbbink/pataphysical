import { getCanvasSize } from '../../../utility/canvas'
import sevenSegment from './seven-segment'

export const clock = (p5) => {
  const backgroundColor = p5.color(33, 33, 40)
  const createDisplays = () => {
    const width = p5.width

    const displayWidth = width / 6
    const start = -width / 2 + displayWidth / 2
    const positions = [
      p5.createVector(start, 0),
      p5.createVector(start + displayWidth * 1, 0),
      p5.createVector(start + displayWidth * 2, 0),
      p5.createVector(start + displayWidth * 3, 0),
      p5.createVector(start + displayWidth * 4, 0),
      p5.createVector(start + displayWidth * 5, 0),
    ]
    const segmentWidth = displayWidth / 2
    const segmentHeight = segmentWidth / 3
    const size = { width: segmentWidth, height: segmentHeight }
    return positions.map((pos, index) => {
      const dis = sevenSegment(p5)(size)
      dis.setPosition(pos)
      return dis
    })
  }
  let displays

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    displays = createDisplays()
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
    p5.background(backgroundColor)

    displays = createDisplays()
  }

  p5.draw = () => {
    const date = new Date()
    const seconds = addZero(date.getSeconds())
    const minutes = addZero(date.getMinutes())
    const hours = addZero(date.getHours())
    const value = `${hours}${minutes}${seconds}`
    ;[...value].forEach((val, index) => {
      displays[index] && displays[index].setValue(toIndexes(val))
    })

    p5.translate(p5.width / 2, p5.height / 2)

    displays.forEach((display) => {
      display.update()
    })
  }
}

const values = new Map()
values.set('1', [1, 2])
values.set('2', [0, 1, 3, 4, 6])
values.set('3', [0, 1, 2, 3, 6])
values.set('4', [1, 2, 5, 6])
values.set('5', [0, 2, 3, 5, 6])
values.set('6', [0, 2, 3, 4, 5, 6])
values.set('7', [0, 1, 2])
values.set('8', [0, 1, 2, 3, 4, 5, 6])
values.set('9', [0, 1, 2, 3, 5, 6])
values.set('0', [0, 1, 2, 3, 4, 5])

const toIndexes = (number) => {
  return values.get(number)
}

const addZero = (i) => (i < 10 ? `0${i}` : i)

clock.date = '2021-06-25'

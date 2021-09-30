import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { matrixLine } from './matrix-line'
import { v4 as uuid } from 'uuid'
import { matrixCli } from './matrix-cli'

let lines = new Map()

const sketch = (p5) => {
  let isDone = false
  const cli = matrixCli(p5)
  let isShowingCli = false
  const lineWidth = 15
  let backgroundColor = p5.color(5, 18, 10)
  let xIndexes = []
  const queue = []
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.textAlign(p5.CENTER)
    p5.textFont('monospace')

    resetXIndexes()
  }

  const resetXIndexes = () => {
    xIndexes = []
    for (let i = -p5.width; i < p5.width; i += lineWidth) {
      xIndexes.push(i)
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  const onDestroyLine = (id) => {
    lines.delete(id)
  }

  const addTextToQueue = (text) => {
    resetXIndexes()
    if (!text) return
    const charArray = text.split('')
    let min
    let max
    charArray.forEach((char, index) => {
      const x = p5.map(
        index,
        0,
        text.length,
        -((text.length / 2) * lineWidth),
        (text.length / 2) * lineWidth,
      )
      addToQueue(x, char)
      if (index === 0) {
        min = x - lineWidth
      }
      if (index === charArray.length - 1) {
        max = x + lineWidth
      }
    })
    // don't drop new lines above the text
    xIndexes = xIndexes.filter((val) => val < min || val > max)
  }

  const addToQueue = (x, char) => {
    queue.push({ x, char })
  }

  const takeFromQueue = () => {
    if (!queue.length) return
    const index = Math.round(p5.random(0, queue.length - 1))
    const [{ char, x }] = queue.splice(index, 1)

    const id = uuid()
    const endY = char ? 0 : p5.height / 2 + 50
    const startPosition = p5.createVector(x, -p5.height / 2)
    const targetPosition = p5.createVector(x, endY)
    lines.set(
      id,
      matrixLine(p5, {
        startPosition,
        targetPosition,
        id,
        onDestroy: onDestroyLine,
        targetSymbol: char,
      }),
    )
  }

  const texts = [
    'COMING SOON',
    'FROM A WOMB NEAR YOU',
    'BABY JENN & THO',
    'MARCH 2022',
  ]

  p5.draw = () => {
    // const symbolCount = Array.from(lines.values()).reduce((acc, curr) => {
    //   return acc + curr.getSymbolLength()
    // }, 0)
    // console.log(
    //   `lines: ${
    //     lines.size
    //   }. symbols: ${symbolCount}. framerate: ${p5.frameRate()}`,
    // )

    if (isShowingCli) {
      return cli.draw()
    }
    p5.translate(p5.width / 2, p5.height / 2)

    p5.background(backgroundColor)

    // add random rain to queue
    if (p5.frameCount % 8 === 0 && !isDone) {
      addToQueue(p5.random(xIndexes))
    }

    // take items from the queue to draw them
    takeFromQueue()

    if (p5.frameCount % 300 === 0) {
      lines.forEach((line) => {
        line.fade()
      })
      if (texts.length) {
        addTextToQueue(texts.shift())
      }
      if (!isDone && lines.size > 0 && texts.length === 0) {
        isDone = true
      }
    }
    if (isDone && lines.size === 0) {
      isShowingCli = true
    }

    lines.forEach((line) => {
      line.update()
    })
  }
}

export default () => <P5Wrapper sketch={sketch} />

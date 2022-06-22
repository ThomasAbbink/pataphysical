import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { matrixLine } from './matrix-line'
import { v4 as uuid } from 'uuid'

const sketch = (p5) => {
  let lines = new Map()
  const lineWidth = 15
  let backgroundColor = p5.color(5, 18, 10)
  let xIndexes = []
  const queue = []

  let hasTyped = false
  let hasGivenTypeHint = false
  let hasPressedEnter = false
  let hasGivenEnterHint = false
  let input = ''
  p5.setup = () => {
    const { width, height } = getCanvasSize()

    p5.createCanvas(width, height)
    p5.textAlign(p5.CENTER)
    p5.textFont('monospace')
    p5.frameRate(60)
    resetXIndexes()
  }

  p5.keyTyped = (event) => {
    if (event.key === 'Enter') {
      if (input) {
        hasPressedEnter = true
        texts.push(input.toUpperCase())
        input = ''
      }
      return
    }
    hasTyped = true
    input = input.concat(event.key)
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

  const texts = []

  p5.draw = () => {
    p5.translate(p5.width / 2, p5.height / 2)

    p5.background(backgroundColor)

    // add random rain to queue
    if (p5.frameCount % 6 === 0) {
      addToQueue(p5.random(xIndexes))
    }

    // take items from the queue to draw them
    takeFromQueue()

    if (p5.frameCount % 300 === 0) {
      lines.forEach((line) => {
        line.fade()
      })
      if (!texts.length) {
        resetXIndexes()
      }
      if (texts.length) {
        addTextToQueue(texts.shift())
      }

      if (!hasTyped && !hasGivenTypeHint) {
        hasGivenTypeHint = true
        texts.push('TYPE SOMETHING')
      }
      if (hasTyped && !hasPressedEnter && !hasGivenEnterHint) {
        hasGivenEnterHint = true
        texts.push('PRESS ENTER')
      }
    }

    lines.forEach((line) => {
      line.update()
    })
  }
}

export default () => <P5Wrapper sketch={sketch} />

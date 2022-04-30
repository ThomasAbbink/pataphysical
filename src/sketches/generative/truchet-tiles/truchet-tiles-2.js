import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { generateOscillatingNumber } from '../../../utility/numbers'
import { P5Wrapper } from '../../P5Wrapper'

const sketch = (p5) => {
  let maxTileSize
  const tiles = []
  let backgroundColor = p5.color(33, 33, 40)
  let getGapSize
  let getTileSize
  let xTiles
  let getStrokeWeight
  let getPieFillOpacity
  let getStroke

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    maxTileSize = p5.width / 5

    getGapSize = generateOscillatingNumber({
      initialValue: maxTileSize / 2,
      min: 0,
      max: maxTileSize,
      easing: p5.random(0.001, 0.002),
      restFrames: 300,
    })

    getTileSize = generateOscillatingNumber({
      initialValue: maxTileSize,
      min: 0,
      max: maxTileSize,
      easing: p5.random(0.003, 0.005),
    })

    getStrokeWeight = generateOscillatingNumber({
      initialValue: 4,
      min: 0.01,
      max: 5,
      increment: 0.01,
      restFrames: 200,
    })
    getStroke = generateOscillatingNumber({
      initialValue: 255,
      min: 0,
      max: 255,
      easing: 0.01,
      restFrames: 300,
    })
    getPieFillOpacity = generateOscillatingNumber({
      initialValue: 50,
      min: 0,
      max: 100,
      easing: 0.01,
      restFrames: 500,
    })

    xTiles = Math.floor(p5.width / maxTileSize)

    for (let x = -xTiles; x < xTiles; x++) {
      for (let y = -xTiles; y < xTiles; y++) {
        tiles.push(tile(p5, { x, y, size: maxTileSize }))
      }
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    p5.background(backgroundColor)
    const gapSize = getGapSize()
    const tileSize = getTileSize()
    const pieFillOpacity = getPieFillOpacity()
    const strokeWeight = getStrokeWeight()
    const stroke = getStroke()
    p5.translate(p5.width / 2, p5.height / 2)
    tiles.forEach((t) => {
      t.draw({ gapSize, tileSize, pieFillOpacity, strokeWeight, stroke })
    })
  }
}

const tile = (p5, { x, y }) => {
  let rotationOffset = p5.HALF_PI * p5.random([0, 1, 2, 3])

  const draw = ({
    gapSize,
    tileSize,
    pieFillOpacity,
    strokeWeight,
    stroke,
  }) => {
    const xOff = x * tileSize - gapSize * y
    const yOff = y * tileSize + gapSize * x
    if (
      xOff < -p5.width ||
      xOff > p5.width ||
      yOff < -p5.height ||
      yOff > p5.height
    ) {
      return
    }
    p5.push()

    // 0, 0 is now in the center of the tile
    p5.translate(xOff, yOff)

    p5.noFill()
    const gapCenter = p5.createVector(
      -tileSize / 2 + gapSize / 2,
      -tileSize / 2 - gapSize / 2,
    )

    p5.strokeWeight(strokeWeight)
    p5.stroke(stroke)

    p5.push()

    // translate to gapCenter
    p5.translate(gapCenter.x, gapCenter.y)
    p5.rotate(rotationOffset)

    p5.fill(p5.color(11, 104, 190, 200))

    p5.rect(-gapSize / 2, -gapSize / 2, gapSize, gapSize)
    p5.fill(0, pieFillOpacity)
    p5.arc(-gapSize / 2, -gapSize / 2, gapSize, gapSize, 0, p5.HALF_PI)
    p5.arc(
      gapSize / 2,
      gapSize / 2,
      gapSize,
      gapSize,
      p5.PI,
      p5.PI + p5.HALF_PI,
    )

    p5.pop()

    p5.push()
    p5.rotate(rotationOffset)

    p5.fill(p5.color(230, 104, 111, 200))

    p5.rect(-tileSize / 2, -tileSize / 2, tileSize, tileSize)

    p5.fill(0, pieFillOpacity)

    p5.arc(-tileSize / 2, -tileSize / 2, tileSize, tileSize, 0, p5.PI / 2)
    p5.arc(
      tileSize / 2,
      tileSize / 2,
      tileSize,
      tileSize,
      p5.PI,
      p5.PI + p5.HALF_PI,
    )

    p5.pop()

    p5.pop()
  }

  return {
    draw,
    x,
    y,
  }
}

export default () => <P5Wrapper sketch={sketch} />

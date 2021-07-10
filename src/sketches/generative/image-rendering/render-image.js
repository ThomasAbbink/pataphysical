import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { getPalette } from '../color-palettes'
import line from './line'

let image
let lines = []
let transitioning = false
const images = [
  'dali',
  'tom-waits',
  'mick-keith',
  'iggy-body',
  'hendrix',
  'joplin',
]

let palette
const sketch = (p5) => {
  palette = getPalette(p5)
  p5.preload = () => {
    transition()
  }

  const loadImage = (imgName, callback) => {
    p5.loadImage(process.env.PUBLIC_URL + `/assets/${imgName}.jpeg`, (im) => {
      image = im
      image.resize(0, p5.height)
      im.loadPixels()
      callback && callback()
    })
  }
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(255)
  }

  const addLine = () => {
    const l = line(p5)
    l.setColor(p5.random(palette))
    l.setBounds({ width: p5.width, height: p5.height })
    l.setGetPixelData(getPixelData)
    lines.push(l)
  }

  const getPixelData = (pos) => {
    if (
      Math.abs(pos.x) > image.width / 2 ||
      Math.abs(pos.y) > image.height / 2
    ) {
      return [255, 255, 255, 255]
    }
    return image.get(pos.x + image.width / 2, pos.y + image.height / 2)
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    if (p5.frameCount % 1000 === 0) {
      transition()
    }
    if (transitioning) {
      p5.background(255, 255, 255, 80)
    } else {
      p5.background(255, 255, 255, 1)
    }
    p5.translate(p5.width / 2, p5.height / 2)
    if (lines.length < 400 && !transitioning) {
      addLine()
    }
    lines.forEach((line, index) => {
      line.update()
      if (line.isOutOfBounds()) {
        lines.splice(index, 1)
      }
    })
  }

  const transition = () => {
    transitioning = true
    palette = getPalette(p5)
    setTimeout(() => {
      loadImage(p5.random(images), () => {
        transitioning = false
      })
    }, 2000)
  }
}

export default () => <P5Wrapper sketch={sketch} />

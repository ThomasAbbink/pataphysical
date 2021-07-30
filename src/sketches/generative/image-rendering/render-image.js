import React from 'react'
import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { createPattern } from './pattern'

let image
let transitioning = false
const images = [
  'dali',
  'tom-waits',
  'hendrix',
  'bond',
  'green_eyes',
  'einstein',
  'walken',
  'afghan-girl',
  'trinity-2',
  'trinity',
]

const patterns = []
let backgroundColor = 255
const sketch = (p5) => {
  p5.preload = () => {
    transition()
  }

  const loadImage = (imgName, callback) => {
    p5.loadImage(process.env.PUBLIC_URL + `/assets/${imgName}.jpeg`, (im) => {
      image = im

      if (image.width < image.height) {
        image.resize(p5.width, 0)
      } else {
        image.resize(0, p5.height)
      }

      im.loadPixels()
      callback && callback()
    })
  }
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(255)
  }

  const getPixelData = (pos) => {
    if (
      !image ||
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
    const c = p5.color(backgroundColor)

    if (p5.frameCount % 1500 === 0) {
      transition()
    }

    if (transitioning) {
      c.setAlpha(40)
    } else {
      c.setAlpha(1)
    }
    p5.background(c)

    p5.translate(p5.width / 2, p5.height / 2)

    patterns.forEach((pattern, index) => {
      pattern.update()
      if (pattern.isDone()) {
        patterns.splice(index, 1)
      }
    })
  }

  let currentImage = ''
  const getNextImageName = () => {
    const next = p5.random(images)
    if (next === currentImage) {
      return getNextImageName()
    }
    currentImage = next
    return next
  }

  const transition = () => {
    transitioning = true
    setTimeout(() => {
      loadImage(getNextImageName(), () => {
        patterns.forEach((pattern) => {
          pattern.stop()
        })
        p5.background(255)
        patterns.push(createPattern(p5, { getPixelData }))
        patterns.push(createPattern(p5, { getPixelData }))
        transitioning = false
      })
    }, 3000)
  }
}

export default () => <P5Wrapper sketch={sketch} />

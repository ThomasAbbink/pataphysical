import { getCanvasSize } from '../../../utility/canvas'
import { createPattern } from './pattern'

let image
let transitioning = false
const images = [
  'dali',
  'tom-waits',
  // 'hendrix',
  'bond',
  'green_eyes',
  // 'einstein',
  // 'walken',
  'afghan-girl',
  'trinity-2',
  'trinity',
]

const patterns = []
let backgroundColor = 255
export const portraits = (p5) => {
  const loadImage = async (imgName) => {
    const im = await p5.loadImage(`/assets/${imgName}.jpeg`)
    image = im

    if (image.width < image.height) {
      image.resize(p5.width, 0)
    } else {
      image.resize(0, p5.height)
    }

    im.loadPixels()
  }

  const getPixelData = (pos) => {
    if (
      !image ||
      Math.abs(pos.x) > image.width / 2 ||
      Math.abs(pos.y) > image.height / 2
    ) {
      return [255, 255, 255, 255]
    }
    const x = Math.floor(pos.x + image.width / 2)
    const y = Math.floor(pos.y + image.height / 2)
    const i = 4 * (y * image.width + x)
    const { pixels } = image
    return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]]
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

  const transition = async (isFirst = false) => {
    transitioning = true

    if (!isFirst) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    await loadImage(getNextImageName())
    patterns.forEach((pattern) => {
      pattern.stop()
    })
    p5.background(255)
    patterns.push(createPattern(p5, { getPixelData }))
    patterns.push(createPattern(p5, { getPixelData }))
    transitioning = false
  }

  p5.setup = async () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(255)
    await transition(true)
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
}

portraits.date = '2021-06-10'

import { getCanvasSize } from '../../../utility/canvas'

import p5 from 'p5'
import { generateOscillatingNumber } from '../../../utility/numbers'

let showimage = false
const backgroundColor = 255
const e = (p5: p5) => {
  let sunrays: ReturnType<typeof sunRay>[] = []
  const waves: ReturnType<typeof wave>[] = []
  const flames: ReturnType<typeof flame>[] = []

  let image: p5.Image | undefined
  let cardWidth = 0
  let cardHeight = 0
  let cardX = 0
  let cardY = 0

  p5.preload = () => {
    p5.loadImage(`/assets/g2.png`, (im) => {
      im.loadPixels()
      im.resize(cardWidth, cardHeight)
      image = im
    })
  }
  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)

    const rayCount = 500
    for (let i = 0; i < rayCount; i++) {
      sunrays.push(
        sunRay(p5, {
          start: p5.createVector(-100 + i * (p5.width / rayCount), 0),
        }),
      )
      waves.push(
        wave(p5, {
          start: p5.createVector(
            -10,
            p5.height / 6 + i * (p5.height / rayCount),
          ),
        }),
      )
      flames.push(
        flame(p5, {
          start: p5.createVector(-100 + i * (p5.width / rayCount), p5.height),
        }),
      )
    }
    resize()
    p5.saveGif('e.gif', 10, { silent: true, units: 'seconds' })
    setTimeout(() => {
      if (image) {
        showimage = !showimage
        p5.background(255, 255, 255, 255)
      }
    }, 9)
    p5.mousePressed = () => {
      if (image) {
        showimage = !showimage
        p5.background(255, 255, 255, 255)
      }
    }
  }

  const getPixelData = (pos: p5.Vector) => {
    if (
      !image ||
      pos.x < cardX ||
      pos.x > cardX + cardWidth ||
      pos.y < cardY ||
      pos.y > cardY + cardHeight
    ) {
      return null
    }
    return image.get(pos.x - cardX, pos.y - cardY)
  }

  const resize = () => {
    const cardAspectRatio = 210 / 148
    const canvasAspectRatio = p5.width / p5.height
    if (canvasAspectRatio < cardAspectRatio) {
      cardWidth = p5.width - p5.width * 0.2
      cardHeight = cardWidth / cardAspectRatio
    }
    if (canvasAspectRatio > cardAspectRatio) {
      cardHeight = p5.height - p5.height * 0.2
      cardWidth = cardHeight * cardAspectRatio
    }
    cardX = p5.width / 2 - cardWidth / 2
    cardY = p5.height / 2 - cardHeight / 2

    if (image) {
      image.resize(cardWidth, cardHeight)
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
    resize()
    p5.background(backgroundColor)
  }
  const opacity = generateOscillatingNumber({
    min: 1,
    max: 4,
    initialValue: 2,
    increment: 0.01,
    minSpeed: 0.01,
    restFrames: 1000,
  })

  p5.draw = () => {
    sunrays.forEach((sunray) => {
      // @ts-ignore
      sunray.draw(getPixelData)
      sunray.update()
    })
    waves.forEach((wave) => {
      // @ts-ignore
      wave.draw(getPixelData)
      wave.update()
    })
    flames.forEach((flame) => {
      // @ts-ignore
      flame.draw(getPixelData)
      flame.update()
    })
    if (image) {
      p5.blend(
        image,
        image.width / 2,
        0,
        image.width / 2,
        image.height,
        cardX + cardWidth / 2,
        cardY,
        cardWidth / 2,
        cardHeight,
        p5.BLEND,
      )
    }
    p5.background(255, 255, 255, opacity())
    if (showimage && image) {
      p5.image(image, cardX, cardY, cardWidth, cardHeight)
    }
    // if (p5.frameCount % 1000 === 0) {
    //   p5.background(255, 255, 255, 255)
    // }
  }
}

const sunRay = (p5: p5, { start }: { start: p5.Vector }) => {
  let position = start.copy()
  const color = [p5.random(255, 255), p5.random(190, 230), 9]
  const size = p5.random(5, 10)
  const speed = p5.random(2, 3)

  const update = () => {
    // use perlin noise to move the ray
    const noise = p5.noise(p5.random(1000000), p5.random(1000000))
    position.add(p5.createVector(noise, 1).setMag(speed))
    if (position.y > p5.height || position.x > p5.width) {
      position = start.copy()
    }
  }
  const draw = (
    getPixelData: (pos: p5.Vector) => [number, number, number, number] | null,
  ) => {
    const pixelData = getPixelData(position)
    // if the ray is more than halfway down, make it smaller

    if (!pixelData) {
      p5.push()
      p5.noStroke()
      p5.fill(color[0], color[1], color[2])
      const s = size
      p5.ellipse(position.x, position.y, s, s)
      p5.pop()
      return
    }

    let brightnessBasedSize = p5.map(pixelData[0], 0, 255, size, 0, true) / 3

    p5.push()
    p5.noStroke()
    p5.fill(color[0], color[1], color[2])

    p5.ellipse(position.x, position.y, brightnessBasedSize, brightnessBasedSize)

    p5.pop()
  }
  return {
    update,
    draw,
  }
}

const wave = (p5: p5, { start }: { start: p5.Vector }) => {
  let position = start.copy()
  const color = [p5.random(40, 50), p5.random(150, 170), 100]
  const speed = p5.random(3, 5)
  const size = p5.random(speed + 4, 10)

  const update = () => {
    // use perlin noise to move the ray
    const noise = p5.noise(p5.random(1000000), p5.random(1000000))
    position.add(
      p5
        .createVector(Math.sin(noise), p5.random(-noise / 4, noise / 4))
        .setMag(speed),
    )
    if (position.y > p5.height || position.x > p5.width) {
      position = start.copy()
    }
  }
  const draw = (
    getPixelData: (pos: p5.Vector) => [number, number, number, number] | null,
  ) => {
    const pixelData = getPixelData(position)

    if (!pixelData) {
      p5.push()
      p5.noStroke()
      p5.fill(color[0], color[1], color[2])
      const s = size
      p5.ellipse(position.x, position.y, s, s)
      p5.pop()
      return
    }

    let brightnessBasedSize = p5.map(pixelData[1], 0, 255, size, 0, true) / 2

    p5.push()
    p5.noStroke()
    p5.fill(color[0], color[1], color[2])
    p5.ellipse(position.x, position.y, brightnessBasedSize, brightnessBasedSize)

    p5.pop()
  }
  return {
    update,
    draw,
  }
}

const flame = (p5: p5, { start }: { start: p5.Vector }) => {
  let position = start.copy()
  const color = [p5.random(240, 255), p5.random(80, 100), 0]
  const speed = p5.random(2, 4)
  const size = p5.random(speed + 4, 10)

  const update = () => {
    // use perlin noise to move the ray
    const noise = p5.noise(p5.random(1000000), p5.random(1000000))
    position.add(
      p5.createVector(Math.sin(noise), -Math.cos(noise)).setMag(speed),
    )
    if (position.y < 0 || position.x < 0) {
      position = start.copy()
    }
  }
  const draw = (
    getPixelData: (pos: p5.Vector) => [number, number, number, number] | null,
  ) => {
    const pixelData = getPixelData(position)

    if (!pixelData) {
      p5.push()
      p5.noStroke()
      p5.fill(color[0], color[1], color[2])
      const s = size
      p5.ellipse(position.x, position.y, s, s)
      p5.pop()
      return
    }

    let brightnessBasedSize = p5.map(pixelData[2], 0, 100, size, 0, true) / 2

    p5.push()
    p5.noStroke()
    p5.fill(color[0], color[1], color[2])
    p5.ellipse(position.x, position.y, brightnessBasedSize, brightnessBasedSize)

    p5.pop()
  }
  return {
    update,
    draw,
  }
}

e.date = '2025-12-29'
export { e }

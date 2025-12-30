import { getCanvasSize } from '../../../utility/canvas'

import p5 from 'p5'

const backgroundColor = 255
const e = (p5: p5) => {
  let cardObject: ReturnType<typeof card> | undefined
  let sunrays: ReturnType<typeof sunRay>[] = []
  const waves: ReturnType<typeof wave>[] = []
  const flames: ReturnType<typeof flame>[] = []

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    cardObject = card(p5)

    const rayCount = 100
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
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
    cardObject?.resize()
    p5.background(backgroundColor)
  }

  p5.draw = () => {
    cardObject?.draw()
    sunrays.forEach((sunray) => {
      // @ts-ignore
      sunray.draw(cardObject?.getPixelData)
      sunray.update()
    })
    waves.forEach((wave) => {
      // @ts-ignore
      wave.draw(cardObject?.getPixelData)
      wave.update()
    })
    flames.forEach((flame) => {
      // @ts-ignore
      flame.draw(cardObject?.getPixelData)
      flame.update()
    })
  }
}

const sunRay = (p5: p5, { start }: { start: p5.Vector }) => {
  let position = start.copy()
  const color = [p5.random(255, 255), p5.random(190, 230), 9]
  const size = p5.random(5, 10)
  const speed = p5.random(1, 3)

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

const wave = (p5: p5, { start }: { start: p5.Vector }) => {
  let position = start.copy()
  const color = [p5.random(0, 10), p5.random(150, 220), 255]
  const speed = p5.random(2, 4)
  const size = p5.random(speed + 4, 10)

  const update = () => {
    // use perlin noise to move the ray
    const noise = p5.noise(p5.random(1000000), p5.random(1000000))
    position.add(p5.createVector(Math.sin(noise), 0).setMag(speed))
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

    let brightnessBasedSize = p5.map(pixelData[2], 0, 255, size, 0, true) / 2

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

    let brightnessBasedSize = p5.map(pixelData[1], 0, 100, size, 0, true) / 2

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

const card = (p5: p5) => {
  let width = 0
  let height = 0
  let x = 0
  let y = 0
  let image: p5.Image | undefined

  const resize = () => {
    const cardAspectRatio = 105 / 148
    const canvasAspectRatio = p5.width / p5.height
    if (canvasAspectRatio < cardAspectRatio) {
      width = p5.width - p5.width * 0.3
      height = width / cardAspectRatio
    }
    if (canvasAspectRatio > cardAspectRatio) {
      height = p5.height - p5.height * 0.3
      width = height * cardAspectRatio
    }
    x = p5.width / 2 - width / 2
    y = p5.height / 2 - height / 2
  }

  const loadImage = () => {
    p5.loadImage(`/assets/e2.png`, (im) => {
      image = im
      image.resize(width, height)
      im.loadPixels()
    })
  }

  const getPixelData = (pos: p5.Vector) => {
    if (
      !image ||
      pos.x < x ||
      pos.x > x + width ||
      pos.y < y ||
      pos.y > y + height
    ) {
      return null
    }
    return image.get(pos.x - x, pos.y - y)
  }

  const draw = () => {
    p5.push()
    p5.noStroke()
    p5.noFill()
    p5.fill(255, 255, 255, 0.1)
    p5.rect(x, y, width, height)
    p5.pop()
  }
  resize()
  loadImage()

  return {
    draw,
    resize,
    getPixelData,
  }
}

e.date = '2025-12-29'
export { e }

import { getCanvasSize } from '../../../utility/canvas'
import { P5Wrapper } from '../../P5Wrapper'
import { v4 as uuid } from 'uuid'

const sketch = (p5) => {
  let backgroundColor = p5.color(11, 33, 88)
  const circles = new Map()

  const createCircle = (values) => {
    const id = uuid()
    circles.set(id, circle(p5, { ...values, id, createCircle, destroyCircle }))
  }

  const destroyCircle = (id) => {
    circles.delete(id)
  }

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height)
    p5.background(backgroundColor)
    const scale = Math.min(width, height) / 1080
    for (let i = 10; i < 100; i += 10) {
      createCircle({ velocity: i, radius: i * scale, scale })
    }
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    p5.translate(p5.width / 2, p5.height / 2)
    p5.noFill()

    p5.background(backgroundColor)
    p5.drawingContext.shadowColor = p5.color(230, 230, 255)
    for (const item of circles) {
      item[1].draw()
    }
  }
}

const circle = (p5, props) => {
  let {
    velocity = 100,
    radius = 200,
    id,
    destroyCircle,
    createCircle,
    translation = { x: 0, y: 0 },
    isStatic,
    stroke = 255,
    scale,
  } = props

  const maxStaticRadius = scale * 600
  const maxRadius = scale * 400
  const minRadius = scale * 10

  let strokeWeight = scale * 15

  let isGrowing = true
  let isFading = false

  const fade = () => {
    strokeWeight -= 0.1
    if (strokeWeight < 0) {
      destroyCircle(id)
    }
  }

  const updateSize = () => {
    if (isStatic) {
      radius += scale
      if (radius > maxStaticRadius) {
        isFading = true
      }
      return
    }

    radius += isGrowing ? scale : -scale

    if (radius > maxRadius || radius < minRadius) {
      isGrowing = !isGrowing
    }

    if (radius > maxRadius) {
      createCircle({
        ...props,
        isStatic: true,
        radius,
        translation: { x: translation.x, y: translation.y },
        strokeWeight: strokeWeight - 1,
      })
    }
  }

  const updatePosition = () => {
    if (!isStatic) {
      translation.x = (-p5.sin((p5.frameCount * velocity) / 10000) * radius) / 2
      translation.y = (p5.cos((p5.frameCount * velocity) / 10000) * radius) / 2
    }
  }

  const update = () => {
    updatePosition()
    updateSize()

    if (isFading) {
      fade()
    }
  }

  return {
    draw: () => {
      p5.push()
      p5.strokeWeight(strokeWeight)
      p5.stroke(stroke)
      p5.drawingContext.shadowBlur = p5.map(maxRadius, 0, 400, 10, 25)
      p5.ellipse(translation.x, translation.y, radius, radius)
      p5.pop()
      update()
    },
  }
}

export default () => <P5Wrapper sketch={sketch} />

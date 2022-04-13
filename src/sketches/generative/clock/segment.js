import line from './line'
import { getPalette } from '../color-palettes'

const segment = (p5) => {
  const palette = getPalette(p5)
  let lines = []
  let position = p5.createVector(0, 0)
  let bounds = { width: 300, height: 300 }
  let rotation = 0
  let isHidden = true
  let backgroundColor = p5.color(33, 33, 40, 100)

  const update = () => {
    p5.push()
    p5.translate(position)
    p5.rotate(rotation)
    lines.forEach((line) => {
      line.update()
    })
    p5.pop()

    if (p5.frameCount % 200 === 0) {
      lines.shift()
    }
    fill()
    createMask()
  }

  const createMask = () => {
    const { width, height } = bounds

    p5.push()
    p5.noStroke()
    p5.translate(position)
    p5.rotate(rotation)
    p5.fill(backgroundColor)
    p5.rect(-width / 2, -height / 2, width, height)

    p5.pop()
  }

  const fill = () => {
    if (lines.length < 8) {
      addLine()
    }
  }

  const addLine = () => {
    const l = line(p5)

    l.setColor(p5.random(palette))
    l.setBounds(bounds)

    lines.push(l)
  }

  const setBounds = (b) => {
    bounds = b
    lines.forEach((line) => {
      line.setBounds(b)
    })
  }

  const setPosition = (p) => {
    position = p
  }

  const setRotation = (angle) => {
    rotation = angle
  }
  const show = () => {
    if (!isHidden) return
    isHidden = false
    backgroundColor = p5.color(33, 33, 40, 0)
  }

  const hide = () => {
    if (isHidden) return
    isHidden = true
    backgroundColor = p5.color(33, 33, 40, 80)
  }

  fill()
  return {
    update,
    setBounds,
    setPosition,
    show,
    hide,
    setRotation,
  }
}

export default segment

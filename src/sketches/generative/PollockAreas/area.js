import line from './line'
import { getPalette } from '../color-palettes'

const area = (p5) => {
  const palette = getPalette(p5)
  const lines = []
  let position = p5.createVector(0, 0)
  let bounds = { width: 300, height: 300 }
  let backgroundOpacity = 0
  let backgroundOpacityVelocity = 0
  let backgroundColor = 0
  let onDestroyed

  const update = () => {
    // fully faded out
    if (backgroundOpacity >= 255) {
      onDestroyed && onDestroyed()
    }
    p5.push()
    p5.translate(position)

    fill()
    lines.forEach((line) => {
      line.update()
    })
    p5.pop()

    // fading out
    p5.push()
    p5.noStroke()
    p5.fill(backgroundColor, backgroundOpacity)
    const extra = 50
    p5.rect(
      position.x - bounds.width / 2 - extra / 2,
      position.y - bounds.height / 2 - extra / 2,
      bounds.width + extra,
      bounds.height + extra,
      10,
    )
    p5.pop()

    // we are fading out
    if (backgroundOpacity > 0 && backgroundColor < 255) {
      backgroundColor += 1
    }

    backgroundColor -= backgroundOpacityVelocity
    backgroundOpacity += backgroundOpacityVelocity
  }

  const fill = () => {
    if (lines.length < 12) {
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

  const fade = (color, callback) => {
    onDestroyed = callback
    backgroundColor = color

    backgroundOpacityVelocity = 1
    lines.forEach((line) => {
      line.setColor(p5.color(255))
    })
  }

  const moveLinesBackHome = () => {
    lines.forEach((line) => {
      line.setTarget(p5.createVector(0, 0))
    })
  }

  return { update, setBounds, setPosition, fade, moveLinesBackHome }
}

export default area

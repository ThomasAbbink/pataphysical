import { Vector } from 'p5'
import { symbol } from './symbol'
import { v4 as uuid } from 'uuid'

/**
 * @param {width: number, height: number} bounds
 * @param {Object} config
 */
export const matrixLine = (
  p5,
  { startPosition, targetPosition, targetSymbol = '', id, onDestroy },
) => {
  const speedLimit = p5.random(3, 5)
  let position = startPosition
  let velocity = p5.createVector(0, 0)
  let acceleration = p5.createVector(0, 0)
  let isFading = false
  let opacity = 255
  const symbols = new Map()

  const isAtTarget = () => {
    return position.dist(targetPosition) <= 10
  }

  const canAddSymbol = () => {
    if (isAtTarget()) {
      return false
    }
    if (!symbols.size) {
      return true
    }
    if (position.dist(targetPosition) < 10) {
      return false
    }

    const lastSymbol = Array.from(symbols.values()).pop()
    return position.dist(lastSymbol.position) > 12
  }

  const onDestroySymbol = (id) => {
    symbols.delete(id)
  }

  const addSymbol = (fixedValue = '') => {
    const id = uuid()
    symbols.set(
      id,
      symbol({
        p5,
        position: fixedValue ? targetPosition : position,
        id,
        onDestroy: onDestroySymbol,
        fixedValue,
      }),
    )
  }

  const fade = () => {
    isFading = true
  }

  const update = () => {
    p5.push()
    if (canAddSymbol()) {
      addSymbol()
    }

    symbols.forEach((symbol) => {
      symbol.draw()
    })

    acceleration = Vector.sub(targetPosition, position)
    velocity.add(acceleration)
    velocity.limit(speedLimit)
    position.add(velocity)

    if (targetSymbol && isAtTarget()) {
      if (isFading) {
        opacity -= 2
      }
      p5.push()
      p5.colorMode(p5.RGB)
      p5.textStyle(p5.BOLD)
      p5.textSize(16)
      p5.fill(240, 255, 240, opacity)
      p5.text(targetSymbol, targetPosition.x, targetPosition.y)
      p5.pop()
    }
    if (
      (!targetSymbol && isAtTarget() && symbols.size === 0) ||
      (targetSymbol && opacity < 0)
    ) {
      onDestroy && onDestroy(id)
    }
    p5.pop()
  }

  const getSymbolLength = () => symbols.size
  return {
    update,
    isAtTarget,
    getSymbolLength,
    fade,
  }
}

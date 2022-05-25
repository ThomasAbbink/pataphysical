export const generateNumber = ({ initialValue, heuristic, ...props }) => {
  let value = initialValue
  const update = () => {
    value = heuristic({ ...props, value })
    return value
  }
  return update
}

export const generateOscillatingNumber = ({
  initialValue,
  increment = 0,
  min,
  max,
  easing = 0,
  minSpeed = (max - min) / 1000,
  restFrames = 0,
}) => {
  if (easing !== 0 && increment !== 0) {
    throw new Error('Cannot have both easing and increment')
  }
  let rest = 0
  let direction = true
  const heuristic = ({ value }) => {
    if (rest > 0) {
      rest -= 1
      return direction ? min : max
    }

    const target = direction ? max : min

    let res
    if (easing !== 0) {
      let diff = Math.abs(target - value)

      if (target < 0 && value > 0) {
        diff = Math.abs(target) + value
      }

      if (target > 0 && value < 0) {
        diff = Math.abs(value) + target
      }
      const val = direction ? value + diff * easing : value - diff * easing

      res = clamp(direction ? val + minSpeed : val - minSpeed, min, max)
    } else {
      res = clamp(direction ? value + increment : value - increment, min, max)
    }

    if (res >= max) {
      rest = restFrames
      direction = false
    }

    if (res <= min) {
      rest = restFrames
      direction = true
    }

    return res
  }

  return generateNumber({
    initialValue: initialValue || min - increment,
    heuristic,
  })
}

export const generateBeatNumber = ({
  min,
  max,
  bpm,
  p5,
  frameRate = 60,
  framesAtBeat = 5,
}) => {
  const heuristic = () => {
    const frameCount = p5.frameCount
    const framesPerBeat = Math.floor(frameRate / (bpm / 60))
    const mod = frameCount % framesPerBeat
    return p5.map(mod, 0, framesAtBeat, max, min, true)
  }
  return generateNumber({ initialValue: min, heuristic })
}

export const generateLoopNumber = ({ initialValue, min, max, increment }) => {
  const heuristic = ({ value }) => {
    const next = value + increment
    if (next > max) {
      return min
    }
    return next
  }
  return generateNumber({ initialValue: initialValue || min, heuristic })
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

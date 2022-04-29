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
  minSpeed = 0.1,
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
      return value
    }

    if (value >= max) {
      rest = restFrames
      direction = false
    }

    if (value <= min) {
      rest = restFrames
      direction = true
    }

    const target = direction ? max : min

    if (easing !== 0) {
      let diff = Math.abs(target - value)

      if (target < 0 && value > 0) {
        diff = Math.abs(target) + value
      }

      if (target > 0 && value < 0) {
        diff = Math.abs(value) + target
      }
      const val = direction ? value + diff * easing : value - diff * easing

      return clamp(direction ? val + minSpeed : val - minSpeed, min, max)
    }

    return clamp(direction ? value + increment : value - increment, min, max)
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
  frameRate,
  framesAtBeat = 5,
}) => {
  const frameCount = p5.frameCount
  const framesPerBeat = Math.floor(frameRate / (bpm / 60))
  const mod = frameCount % framesPerBeat
  return p5.map(mod, 0, framesAtBeat, max, min, true)
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

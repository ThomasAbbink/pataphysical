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
  increment,
  min,
  max,
}) => {
  let direction = true
  const heuristic = ({ value }) => {
    if (value >= max) {
      direction = false
    }
    if (value <= min) {
      direction = true
    }
    return direction ? value + increment : value - increment
  }
  return generateNumber({
    initialValue: initialValue || min - increment,
    heuristic,
  })
}

export const generateBeatNumber = ({ min, max, bpm, p5, frameRate }) => {
  const frameCount = p5.frameCount
  const framesPerBeat = Math.floor(frameRate / (bpm / 60))
  const mod = frameCount % framesPerBeat
  return p5.map(mod, 0, 5, max, min, true)
}

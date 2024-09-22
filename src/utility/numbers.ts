import p5 from 'p5'

type GenerateNumberProps = {
  initialValue: number
  heuristic: ({ value }: { value: number }) => number
}

export const generateNumber = ({
  initialValue,
  heuristic,
}: GenerateNumberProps) => {
  let value = initialValue
  const update = () => {
    value = heuristic({ value })
    return value
  }
  return update
}

type Props = {
  initialValue: number
  increment: number
  min: number
  max: number
  easing: number
  minSpeed: number
  restFrames: number
}
export const generateOscillatingNumber = ({
  initialValue,
  increment = 0,
  min,
  max,
  easing = 0,
  minSpeed = (max - min) / 1000,
  restFrames = 0,
}: Props) => {
  if (easing !== 0 && increment !== 0) {
    throw new Error('Cannot have both easing and increment')
  }
  let rest = 0
  let direction = true
  const heuristic = ({ value }: { value: number }) => {
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

type BeatProps = {
  min: number
  max: number
  bpm: number
  p5: p5
  frameRate: number
  framesAtBeat: number
}
export const generateBeatNumber = ({
  min,
  max,
  bpm,
  p5,
  frameRate = 60,
  framesAtBeat = 5,
}: BeatProps) => {
  const heuristic = () => {
    const frameCount = p5.frameCount
    const framesPerBeat = Math.floor(frameRate / (bpm / 60))
    const mod = frameCount % framesPerBeat
    return p5.map(mod, 0, framesAtBeat, max, min, true)
  }
  return generateNumber({ initialValue: min, heuristic })
}

type LoopProps = {
  min: number
  max: number
  initialValue: number
  increment: number
}

export const generateLoopNumber = ({
  min,
  max,
  initialValue,
  increment,
}: LoopProps) => {
  const heuristic = ({ value }: { value: number }) => {
    const next = value + increment
    if (next > max) {
      return min
    }
    return next
  }
  return generateNumber({ initialValue: initialValue || min, heuristic })
}

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

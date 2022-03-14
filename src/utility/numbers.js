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

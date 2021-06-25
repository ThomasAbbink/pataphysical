import segment from './segment'

const segmentData = (p5) => (size) => {
  const { width, height } = size

  return [
    { index: 0, x: 0, y: -width - height, rotation: 0 },
    {
      index: 1,
      x: width / 2 + height / 2,
      y: -width / 2 - height / 2,
      rotation: p5.HALF_PI,
    },
    {
      index: 2,
      x: width / 2 + height / 2,
      y: width / 2 + height / 2,
      rotation: p5.HALF_PI,
    },
    { index: 3, x: 0, y: width + height, rotation: p5.PI },
    {
      index: 4,
      x: -width / 2 - height / 2,
      y: width / 2 + height / 2,
      rotation: p5.HALF_PI * 3,
    },
    {
      index: 5,
      x: -width / 2 - height / 2,
      y: -width / 2 - height / 2,
      rotation: p5.HALF_PI * 3,
    },
    { index: 6, x: 0, y: 0, rotation: 0 },
  ]
}

const createSegments = (p5) => (size) => {
  return segmentData(p5)(size).map((data) => {
    const { x, y, rotation } = data
    const { width, height } = size
    const s = segment(p5)
    s.setPosition(p5.createVector(x, y))
    s.setBounds({ width, height })
    s.setRotation(rotation)
    return s
  })
}

const sevenSegment = (p5) => (size) => {
  const segments = createSegments(p5)(size)
  let position = p5.createVector(0, 0)
  const update = () => {
    segments.forEach((s) => {
      p5.push()
      p5.translate(position)
      s.update()
      p5.pop()
    })
  }

  const setValue = (value = []) => {
    segments.forEach((s, index) => {
      value.includes(index) ? s.show() : s.hide()
    })
  }
  const setPosition = (pos) => {
    position = pos
  }

  return { update, setValue, setPosition }
}

export default sevenSegment

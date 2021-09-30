export const symbol = ({
  p5,
  position,
  onDestroy,
  id,
  startBrightness = 80,
  fixedValue = '',
}) => {
  const initialFrameCount = p5.frameCount
  const intervalMillis = p5.round(p5.random(30, 200))
  const pos = p5.createVector(position.x, position.y)
  let value = randomValue(p5)
  let saturation = 0

  let brightness = startBrightness
  let isFading = false
  let isTurningGreen = false

  const draw = () => {
    if (isFading) {
      brightness -= 2
    }
    if (isTurningGreen) {
      saturation += 10
    }

    if (p5.frameCount % intervalMillis === 0) {
      if (!fixedValue && p5.random(0, 100) > 50) {
        value = randomValue(p5)
      }
      if (p5.frameCount > initialFrameCount) {
        isFading = true
      }
    }
    if (!isTurningGreen && p5.frameCount > initialFrameCount + 2) {
      isTurningGreen = true
    }
    p5.push()
    p5.colorMode(p5.HSB)
    p5.textStyle(p5.BOLD)
    p5.textSize(16)
    p5.fill(p5.color(140, saturation, brightness))
    p5.text(fixedValue || value, pos.x, pos.y)
    p5.pop()
    checkDead()
  }

  const checkDead = () => {
    if (brightness <= 0) {
      onDestroy(id)
    }
  }

  return { draw, position: pos }
}

const kanji = '日'
const katakana = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ'
const numbers = '012345789'
const letters = 'Z'
const other = ':."=*+-¦|_ '
const all = Array.from(
  `${kanji}${katakana}${numbers}${letters}${other}`.split(''),
)
const randomValue = (p5) => {
  return p5.random(all)
}

let backgroundColor = [5, 18, 10]
const textColor = [160, 220, 150]
export const matrixCli = (p5, onDone) => {
  let cli = cliText(p5)
  let isDone = false
  let isWriting = false
  const textLines = [
    'Wake up, little one...',
    'Morpheus wants to play with you...',
  ]
  let currentTextLine = 0
  let text = ''
  let currentChar = 0

  let frameCount = 0
  const startWritingNextLine = () => {
    isWriting = true

    // see if we are done writing
    if (textLines[currentTextLine] === text) {
      frameCount++
    }
    if (frameCount > 200) {
      if (textLines.length > currentTextLine + 1) {
        text = ''
        currentChar = 0
        currentTextLine++
        frameCount = 0
      } else {
        if (!isDone) {
          isDone = true
          onDone && onDone()
        }
      }
    }
  }

  const draw = () => {
    startWritingNextLine()

    if (isWriting && p5.frameCount % 7 === 0) {
      if (currentChar < textLines[currentTextLine].length) {
        text = text.concat(textLines[currentTextLine][currentChar])
        cli.setText(text)
        currentChar++
      }
    }
    p5.background(backgroundColor)

    cli.draw()
  }
  return { draw }
}

const cliText = (p5) => {
  let showCaret = true
  let text = ''
  const setText = (t) => {
    showCaret = false
    text = t
  }
  const draw = () => {
    if (p5.frameCount % 40 === 0) {
      showCaret = !showCaret
    }
    p5.push()
    p5.textAlign(p5.LEFT)
    p5.textStyle(p5.BOLD)
    p5.textSize(30)
    p5.fill(textColor)
    p5.text(`> ${text}${showCaret ? '|' : ''}`, 20, 50)
    p5.pop()
  }
  return { draw, setText }
}

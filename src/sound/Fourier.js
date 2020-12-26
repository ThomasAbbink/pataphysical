import { P5Wrapper } from '../P5Wrapper'
import React from 'react'
import p5 from 'p5'
import { getCanvasSize } from '../p5-utility/canvas'

const sketch = (p) => {
  let mic
  let fft
  p.setup = () => {
    mic = new p5.AudioIn()
    mic.start()
    p.getAudioContext().resume()
    mic.amp(1)
    const { width, height } = getCanvasSize()
    p.createCanvas(width, height)
    fft = new p5.FFT()
    fft.setInput(mic)
    p.angleMode(p.DEGREES)
    p.rectMode(p.CENTER)
  }

  p.windowResized = () => {
    const { width, height } = getCanvasSize()
    p.resizeCanvas(width, height)
  }

  p.draw = () => {
    const { width, height } = getCanvasSize()

    fft.smooth()

    const spectrum = fft.analyze()

    p.background(0)
    // p.noStroke()
    // p.fill(255, 100, 0)
    // for (let i = 0; i < spectrum.length; i++) {
    //   let x = p.map(i, 0, spectrum.length, 0, width)
    //   let h = -height + p.map(spectrum[i], 0, 255, height, 0)
    //   p.rect(x, height - 30, width / spectrum.length, h)
    // }
    // p.stroke(255)
    // p.noFill()

    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        const x = p.map(i, 0, 32, 0, width)
        const y = p.map(j, 0, 32, 0, height)

        const s = spectrum[i * j]
        const red = p.map(s, 0, 255, 100, 255)
        const green = p.map(s, 0, 255, 0, 100)
        const blue = p.map(s, 0, 255, 0, 100)
        p.stroke(red, green, blue)
        p.fill(red, green, blue)
        p.strokeWeight(2)
        if (s === 0) {
          p.noFill()
          p.noStroke()
        }
        p.push()
        p.translate(x + 5, y + 5)
        p.rotate(p.map(s, 0, 255, 0, 720))
        // p.line(-5, -5, 5, 5)
        // p.noFill()
        // p.rect(0, 0, 10, 10)
        p.arc(0, 0, 30, 30, -90, s - 90)
        p.pop()
      }
    }
  }
}

export default () => <P5Wrapper sketch={sketch} />

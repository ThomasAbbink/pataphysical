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
  }

  p.windowResized = () => {
    const { width, height } = getCanvasSize()
    p.resizeCanvas(width, height)
  }

  p.draw = () => {
    const { width, height } = getCanvasSize()
    const spectrum = fft.analyze()

    p.background(0)
    p.translate(width / 2, height / 2)
    p.stroke(255)

    let factor = 20
    const data = spectrum.reduce((acc, curr, index) => {
      if (index % factor === 0) {
        return [...acc, curr]
      }

      const next = [...acc]
      const last = next[next.length - 1]
      if (last) {
        next[acc.length - 1] = last + curr
      }
      next[acc.length - 1] = 0
      return next
    }, [])
    console.log(data)
    const sliceDegree = 360 / spectrum.length
    for (let i = 0; i < spectrum.length; i += factor) {
      const sliceHeight = p.map(spectrum[i], 0, 255, 500, 1000)
      const red = p.map(i, 0, spectrum.length % 255, 10, 255)
      const green = p.map(i, 0, spectrum.length, 20, 255)
      const blue = p.map(i, 0, spectrum.length, 40, 255)

      const start = sliceDegree * i + -90
      const end = start + sliceDegree * factor
      p.stroke(red, green, blue)
      p.fill(red, green, blue)
      p.rotate(factor)
      p.arc(0, 0, sliceHeight, sliceHeight, start, end)
    }
  }
}

export default () => <P5Wrapper sketch={sketch} />

import { P5Wrapper } from '../P5Wrapper'
import React from 'react'
import p5 from 'p5'
import { getCanvasSize } from '../../utility/canvas'
import { average } from '../../utility/array'

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
  // lower = more slices
  let rotate = 0
  p.draw = () => {
    const { width, height } = getCanvasSize()
    const spectrum = fft.analyze()

    p.background(0)
    p.translate(width / 2, height / 2)
    p.stroke(255)
    const spectrumAverage = 2

    const factor = Math.round(p.map(spectrumAverage, 0, 50, 30, 25, true))

    const data = spectrum
      //array of arrays with length factor
      .reduce((acc, curr, index) => {
        if (index === 0 || index % factor === 0) {
          return [...acc, [curr]]
        }
        return [...acc.slice(0, acc.length - 1), [...acc[acc.length - 1], curr]]
      }, [])
      .map(average)

    const sliceDegree = 360 / data.length

    for (let i = 0; i < data.length; i++) {
      const sliceHeight = p.map(data[i], 0, 255, 300, 600, true)
      const red = p.map(i, 0, data.length, 100, 255)
      const green = p.map(i, 0, data.length, 20, 255)
      const blue = p.map(i, 0, data.length, 40, 200)

      const start = sliceDegree * i - 90
      const end = start + sliceDegree
      p.stroke(red, green, blue)
      p.fill(red, green, blue)
      p.rotate(rotate)
      p.arc(0, 0, sliceHeight, sliceHeight, start - 0.1, end)
    }
    rotate += 0.1
  }
}

export default () => <P5Wrapper sketch={sketch} />

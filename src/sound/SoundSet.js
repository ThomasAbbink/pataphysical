import { P5Wrapper } from '../P5Wrapper'
import React from 'react'
import p5 from 'p5'
import { getCanvasSize } from '../p5-utility/canvas'

const normalize = (array) => {
  const even = array.filter((curr, index) => index % 2 === 0)
  const uneven = array.filter((curr, index) => index % 2 !== 0)

  return [...even.reverse(), ...uneven]
}

const sketch = (p) => {
  let mic
  let fft
  let width, height
  let waves = []

  const setDimensions = () => {
    const { width: w, height: h } = getCanvasSize()
    p.resizeCanvas(w, h)
    width = w
    height = h
  }

  p.setup = () => {
    setDimensions()
    mic = new p5.AudioIn()
    mic.start()
    p.getAudioContext().resume()
    mic.amp(1)

    p.createCanvas(width, height)
    fft = new p5.FFT(0.9, 16)
    fft.setInput(mic)
    p.angleMode(p.DEGREES)
    for (let i = 0; i < 11; i++) {
      waves.push(wave(i))
    }
  }

  p.windowResized = () => {
    setDimensions()
    waves = []
    for (let i = 0; i < 11; i++) {
      waves.push(wave(i))
    }
  }

  const wave = (index) => {
    let lineHeight = index * 50
    const increment = () => {
      lineHeight += 1
      if (lineHeight > height / 2 - 200) {
        lineHeight = 0
      }
    }
    const draw = (waveform) => {
      increment()
      p.beginShape()
      p.stroke(255)
      p.fill(236, 181, 80)
      for (let i = 0; i < waveform.length; i++) {
        let x = p.map(i, 0, waveform.length, -width, width)
        let y = p.map(waveform[i], -1, 1, -height, height)
        p.vertex(x, lineHeight + y)
      }
      p.endShape()
    }
    return {
      draw,
    }
  }

  p.draw = () => {
    const spectrum = fft.analyze()
    const normalized = normalize(spectrum)
    const waveform = fft.waveform(16)

    p.background(226, 131, 65)
    p.translate(width / 2, height / 2)

    // draw sun
    // one full arc
    p.fill(254, 252, 225)
    p.arc(0, 0, 100, 100, -180, 180)
    const sliceThickness = 2

    for (let i = 0; i < normalized.length; i++) {
      const sliceHeight = p.map(normalized[i], 0, 500, 150, 300, true)

      const start = (180 / normalized.length) * i - 180
      const end = start + sliceThickness

      p.arc(0, 0, sliceHeight, sliceHeight, start, end)
    }

    //wave background
    //draw sand
    p.noStroke()
    p.fill(236, 181, 80)
    p.beginShape()
    p.vertex(width / 2, 0)
    p.vertex(-width / 2, 0)
    p.vertex(-width / 2, height / 2)
    p.vertex(width / 2, height / 2)
    p.endShape()

    waves.forEach((w) => {
      w.draw(waveform)
    })

    //draw sand
    p.noStroke()
    p.fill(92, 18, 43)
    p.beginShape()
    p.vertex(width / 2, height / 2 - 200)
    p.vertex(-width / 2, height / 2 - 200)
    p.vertex(-width / 2, height / 2)
    p.vertex(width / 2, height / 2)
    p.endShape()
  }
}

export default () => <P5Wrapper sketch={sketch} />

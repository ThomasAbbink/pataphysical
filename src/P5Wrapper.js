import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import styled from 'styled-components'

export const P5Wrapper = ({ sketch }) => {
  const ref = useRef()
  const p5ref = useRef()

  useEffect(() => {
    p5ref.current = new p5(sketch, ref.current)
    return () => {
      p5ref.current.remove()
    }
  })

  return <SketchWrapper id="sketch-wrapper" ref={ref} />
}

const SketchWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: black;
  justify-content: center;
  align-items: center;
`

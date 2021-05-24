import React, { useState } from 'react'
import styled from 'styled-components'

export default function Kiosk({ sketches = [] }) {
  const [currentSketch, setCurrentSketch] = useState(0)
  setTimeout(() => {
    let nextSketch = currentSketch + 1
    if (!sketches[nextSketch]) {
      nextSketch = 0
    }

    setCurrentSketch(nextSketch)
  }, [60000])

  return <Container>{sketches[currentSketch]()}</Container>
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
`

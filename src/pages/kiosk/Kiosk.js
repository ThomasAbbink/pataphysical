import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

export default function Kiosk({ children }) {
  const timeout = 60000
  const [currentSketch, setCurrentSketch] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let nextSketch = currentSketch + 1
      if (!children[nextSketch]) {
        nextSketch = 0
      }

      setCurrentSketch(nextSketch)
    }, [timeout])
    return () => {
      clearTimeout(timer)
    }
  }, [children, currentSketch])

  return (
    <Container>
      {children[currentSketch]}
      <ProgressBar timeout={timeout} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`

const ProgressBar = styled.div`
  @keyframes barWidth {
    0% {
      transform: scaleX(100%);
    }
    100% {
      transform: scaleX(0);
    }
  }

  height: 1px;
  background-color: black;
  animation: ${({ timeout }) =>
    `barWidth calc(${timeout} * 1ms) linear infinite alternate;`};
`

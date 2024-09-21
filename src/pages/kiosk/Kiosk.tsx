import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { backgroundColor } from '../../style/colors'
import KioskSketchWrapper from './KioskSketchWrapper'

export default function Kiosk({ sketches }) {
  const timeout = 60000
  const [currentSketch, setCurrentSketch] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let nextSketch = currentSketch + 1
      if (!sketches[nextSketch]) {
        nextSketch = 0
      }

      setCurrentSketch(nextSketch)
    }, [timeout])
    return () => {
      clearTimeout(timer)
    }
  }, [sketches, currentSketch])

  return (
    <Container>
      <KioskSketchWrapper sketch={sketches[currentSketch]} />
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

  height: 3px;
  background-color: white;
  animation: ${({ timeout }) =>
    `barWidth calc(${timeout} * 1ms) linear infinite alternate;`};
`

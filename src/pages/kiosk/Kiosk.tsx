import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import KioskSketchWrapper from './KioskSketchWrapper'
import { Sketch } from '../../types/Sketch'

type Props = {
  sketches: Sketch[]
  timeout?: number
  breakoutSketch?: Sketch
}

// Logitech R400 key mapping:
//   back       -> PageUp
//   forward    -> PageDown
//   slideshow  -> F5 / Escape (alternates on each press)
//   blank      -> '.' (some presenters send 'b')
const NEXT_KEYS = ['PageDown', 'ArrowRight']
const PREVIOUS_KEYS = ['PageUp', 'ArrowLeft']
const BREAKOUT_KEYS = ['F5', 'Escape']
const PAUSE_KEYS = ['.', 'b', 'B', ' ']

export default function Kiosk({
  sketches,
  timeout = 60000,
  breakoutSketch,
}: Props) {
  const [currentSketch, setCurrentSketch] = useState(0)
  const [isBrokenOut, setIsBrokenOut] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  // Bumped on resume so the timer and progress bar restart
  const [runId, setRunId] = useState(0)

  const step = useCallback(
    (delta: number) => {
      setIsBrokenOut(false)
      setCurrentSketch(
        (current) => (current + delta + sketches.length) % sketches.length,
      )
    },
    [sketches.length],
  )

  const isRunning = !isPaused && !isBrokenOut

  useEffect(() => {
    if (!isRunning) return
    const timer = setTimeout(() => step(1), timeout)
    return () => {
      clearTimeout(timer)
    }
  }, [step, currentSketch, timeout, isRunning, runId])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (NEXT_KEYS.includes(event.key)) {
        event.preventDefault()
        step(1)
      } else if (PREVIOUS_KEYS.includes(event.key)) {
        event.preventDefault()
        step(-1)
      } else if (BREAKOUT_KEYS.includes(event.key) && breakoutSketch) {
        event.preventDefault()
        setIsBrokenOut((brokenOut) => !brokenOut)
        setRunId((id) => id + 1)
      } else if (PAUSE_KEYS.includes(event.key)) {
        event.preventDefault()
        setIsPaused((paused) => !paused)
        setRunId((id) => id + 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [step, breakoutSketch])

  const sketch =
    isBrokenOut && breakoutSketch ? breakoutSketch : sketches[currentSketch]

  return (
    <Container>
      <KioskSketchWrapper sketch={sketch} />
      <ProgressBar
        key={`${currentSketch}-${runId}`}
        timeout={timeout}
        $hidden={!isRunning}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`

const ProgressBar = styled.div<{ timeout: number; $hidden: boolean }>`
  @keyframes barWidth {
    0% {
      transform: scaleX(100%);
    }
    100% {
      transform: scaleX(0);
    }
  }

  /* Keep the bar's height when hidden so the canvas doesn't resize */
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
  height: 3px;
  background-color: white;
  animation: ${({ timeout }) =>
    `barWidth calc(${timeout} * 1ms) linear infinite alternate;`};
`

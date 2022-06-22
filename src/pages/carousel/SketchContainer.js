import { useRef } from 'react'
import styled from 'styled-components'
import useIntersectionObserver from '../../utility/useIntersectionObserver'

export default ({ sketch }) => {
  const ref = useRef()
  const entry = useIntersectionObserver(ref, {
    threshold: 0.01,
  })
  const isVisible = !!entry?.isIntersecting
  return (
    <Container key={sketch.id} ref={ref}>
      {isVisible && sketch}
    </Container>
  )
}

const Container = styled.div`
  background-color: black;
  display: flex;
  flex-grow: 1;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  scroll-snap-align: start;
`

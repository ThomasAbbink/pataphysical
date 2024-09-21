import styled from 'styled-components'
import { useP5 } from '../../utility/useP5'
import { Sketch } from '../../types/Sketch'

type Props = {
  sketch: Sketch
}

export default ({ sketch }: Props) => {
  const { ref: canvasRef, isVisible } = useP5(sketch)

  return (
    <Container
      key={sketch.name}
      id="sketch-wrapper"
      ref={canvasRef}
      isVisible={isVisible}
    />
  )
}

const Container = styled.div`
  scroll-snap-align: start;
  width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  opacity: ${({ isVisible }: { isVisible: boolean }) => (isVisible ? 1 : 0)};
  transition: opacity 1.5s ease-out;
`

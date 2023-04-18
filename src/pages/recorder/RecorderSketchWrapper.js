import styled from 'styled-components'
import { SketchRecorder } from '../../components/SketchRecorder'
import { useP5 } from '../../utility/useP5'

export default ({ sketch }) => {
  const { ref: canvasRef, isVisible, p5 } = useP5(sketch)
  console.log(p5)
  return (
    <>
      {p5.current && <SketchRecorder p5={p5} />}
      <Container
        key={sketch.name}
        id="sketch-wrapper"
        ref={canvasRef}
        isVisible={isVisible}
      />
    </>
  )
}

const Container = styled.div`
  scroll-snap-align: start;
  width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 1.5s ease-out;
`

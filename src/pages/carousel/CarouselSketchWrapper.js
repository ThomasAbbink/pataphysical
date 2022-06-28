import styled from 'styled-components'
import { backgroundColor } from '../../style/colors'
import { useP5 } from '../../utility/useP5'

export default ({ sketch }) => {
  const { ref: canvasRef } = useP5(sketch)

  return <Container key={sketch.name} id="sketch-wrapper" ref={canvasRef} />
}

const Container = styled.div`
  scroll-snap-align: start;
  width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  background-color: ${backgroundColor};
`

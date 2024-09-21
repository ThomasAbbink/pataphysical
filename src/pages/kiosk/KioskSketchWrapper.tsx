import styled from 'styled-components'
import { useP5 } from '../../utility/useP5'

export default ({ sketch }) => {
  const { ref: canvasRef } = useP5(sketch)
  return <Wrapper id="sketch-wrapper" ref={canvasRef} />
}

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
`

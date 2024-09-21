import styled from 'styled-components'
import { useP5 } from '../../utility/useP5'
import { Sketch } from '../../types/Sketch'

type Props = {
  sketch: Sketch
}
export default ({ sketch }: Props) => {
  const { ref: canvasRef } = useP5(sketch)
  return <Wrapper id="sketch-wrapper" ref={canvasRef} />
}

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
`

import styled from 'styled-components'
import SketchContainer from './SketchContainer'

export default ({ children }) => {
  return (
    <Container>
      {children.map((s) => (
        <SketchContainer sketch={s} key={s.key} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: white;
  scroll-behavior: smooth;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  scroll-snap-type: y mandatory;
`

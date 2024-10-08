import styled from 'styled-components'
import { backgroundColor } from '../../style/colors'
import CarouselSketchWrapper from './CarouselSketchWrapper'
import { Sketch } from '../../types/Sketch'

type Props = {
  sketches: Sketch[]
}

export default ({ sketches }: Props) => {
  return (
    <Container>
      {sketches
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((s) => (
          <CarouselSketchWrapper sketch={s} key={s.name} />
        ))}
      <Footer />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  scroll-behavior: smooth;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  scroll-snap-type: y mandatory;
`

const Footer = styled.div`
  width: 100%;
  background-color: ${backgroundColor};
  height: 100px;
  min-height: 100px;
`

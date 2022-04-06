import React, { useState } from 'react'
import styled from 'styled-components'

export default ({ children }) => {
  const [currentSketch, setCurrentSketch] = useState(0)
  const onNext = () => {
    setCurrentSketch((currentSketch) => {
      if (currentSketch === children.length - 1) {
        return 0
      }
      return currentSketch + 1
    })
  }
  const onPrev = () => {
    setCurrentSketch((currentSketch) => {
      if (currentSketch === 0) {
        return children.length - 1
      }
      return currentSketch - 1
    })
  }
  return (
    <Container>
      <Next onClick={onNext}>
        <Chevron />
      </Next>
      <Prev onClick={onPrev}>
        <LeftChevron />
      </Prev>
      <Card key={currentSketch}>{children[currentSketch]}</Card>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: white;
`
const Card = styled.div`
  display: flex;
  flex-grow: 1;
`

const Flipper = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3rem;
  height: 100%;
  align-items: center;
  transition: 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.4);
  }
`
const Next = styled(Flipper)`
  right: 0;
  justify-content: flex-end;
  padding-right: 5px;
`

const Prev = styled(Flipper)`
  left: 0;
  justify-content: flex-start;
  padding-left: 5px;
`

const Chevron = styled.div`
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-left: 30px solid slategray;
`

const LeftChevron = styled(Chevron)`
  transform: rotate(180deg);
`

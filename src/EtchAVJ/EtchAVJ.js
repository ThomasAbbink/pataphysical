import React, { useState } from 'react'
import styled from 'styled-components'
import Line from './Line'
import Draw from './Draw'
import defaultDrawings from './default-drawings'

export const EtchAVJ = () => {
  const [isDrawing, setIsDrawing] = useState(true)
  const [savedDrawings, setSavedDrawings] = useState(defaultDrawings)
  const onClickSwitch = () => {
    setIsDrawing((curr) => !curr)
  }
  const [currentVectors, setCurrentVectors] = useState(
    defaultDrawings[0].vectors,
  )
  const onAddVector = ({ x, y }) => {
    setCurrentVectors((curr) => [...curr, { x, y }])
  }
  const onSave = () => {}

  const onDeselect = () => {}
  return (
    <Container>
      <button onClick={onClickSwitch}>
        {isDrawing ? 'Check it out' : 'back to the drawing board'}
      </button>
      {isDrawing ? (
        <Draw onAddVector={onAddVector} initialVectors={currentVectors} />
      ) : (
        <Line />
      )}
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid: ;
`

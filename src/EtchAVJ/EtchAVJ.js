import React, { useState } from 'react'
import styled from 'styled-components'
import Line from './Line'
import Draw from './Draw'
import defaultShapes from './default-shapes'

export const EtchAVJ = () => {
  const [isDrawing, setIsDrawing] = useState(true)
  const [savedShapes, setSavedShapes] = useState(defaultShapes)
  const onClickSwitch = () => {
    setIsDrawing((curr) => !curr)
  }

  const onSaveShape = (vectors = () => []) => {
    setSavedShapes((curr) => {
      return [...curr, { name: '', vectors }]
    })
  }

  return (
    <Container>
      <button onClick={onClickSwitch}>
        {isDrawing ? 'Check it out' : 'back to the drawing board'}
      </button>
      {isDrawing ? (
        <Draw onSaveShape={onSaveShape} initialShapes={savedShapes} />
      ) : (
        <Line shapes={savedShapes} />
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

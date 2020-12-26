import React, { useState } from 'react'
import styled from 'styled-components'
import { Show } from './Show'
import { Draw } from './Draw'
import { ShapeList } from './shape-list/ShapeList'
import defaultShapes from './default-shapes'
import { generateShapeName } from './generateName'

export const EtchAVJ = () => {
  const [isDrawing, setIsDrawing] = useState(true)
  const [savedShapes, setSavedShapes] = useState(defaultShapes)
  const [currentShape, setCurrentShape] = useState(null)

  const onClickSwitch = () => {
    setIsDrawing((curr) => !curr)
  }

  const onClickShape = (shapeName) => {
    const shape = savedShapes.find((s) => s.name === shapeName)
    setCurrentShape(shape)
  }

  const onSaveShape = (vectors = () => []) => {
    setSavedShapes((curr) => {
      return [...curr, { name: generateShapeName(), vectors }]
    })
  }

  const onRemoveShape = (name) => {
    if (!name) return
    setSavedShapes((current) => {
      return current.filter((it) => it.name !== name)
    })
  }

  const currentVectors = currentShape ? currentShape.vectors() : []

  return (
    <Container>
      {isDrawing ? (
        <Draw onSaveShape={onSaveShape} initialVectors={currentVectors} />
      ) : (
        <Show shapes={savedShapes} />
      )}

      <Controls>
        <ShapeList
          shapes={savedShapes}
          onRemoveShape={onRemoveShape}
          onClickShape={onClickShape}
        />

        <SwitchButton onClick={onClickSwitch}>
          {isDrawing ? 'Check it out' : 'back to the drawing board'}
        </SwitchButton>
      </Controls>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
`

const Controls = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  background-color: black;
`

const SwitchButton = styled.button`
  width: 10rem;
  height: 2rem;
  border: none;
  background-color: #333;
  color: #fff;
  border: 1px solid white;
  border-radius: 5px;
`

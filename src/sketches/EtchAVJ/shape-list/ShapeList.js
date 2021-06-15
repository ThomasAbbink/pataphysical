import React from 'react'
import styled from 'styled-components'
import ListItem from './ShapeListItem'

export const ShapeList = ({ shapes = [], onRemoveShape, onClickShape }) => {
  return (
    <List>
      <ListHeader>Current Sketches</ListHeader>
      {shapes.map((shape, index) => (
        <ListItem
          key={shape.key}
          name={shape.name}
          onRemoveShape={onRemoveShape}
          onClickShape={onClickShape}
        />
      ))}
    </List>
  )
}

const List = styled.ul`
  box-sizing: border-box;
  width: 200px;
  height: 200px;
  list-style-typ%e: none;
  margin: 0;
  overflow-y: scroll;
  justify-content: flex-start;
`
const ListHeader = styled.div`
  color: white;
  margin: 0px 10px 2px 5px;
  text-align: center;
`

import React from 'react'
import styled from 'styled-components'

export default ({
  key,
  name,
  onRemoveShape = () => {},
  onClickShape = () => {},
}) => {
  const onClickRemove = () => {
    onRemoveShape(name)
  }

  const onClick = () => {
    onClickShape(name)
  }

  return (
    <Li key={key} onClick={onClick}>
      {name}
      <Remove onClick={onClickRemove} className="remove">
        X
      </Remove>
    </Li>
  )
}

const Li = styled.li`
  color: white;
  align-items: center;
  border: 1px solid transparent;
  :hover {
    .remove {
      visibility: visible;
    }
  }
  display: flex;

  height: 2rem;
  justify-content: space-between;
  text-overflow: ellipsis;
  overflow: hidden;
  max-lines: 1;
  border: 1px solid white;
  border-radius: 5px;
  margin: 0px 10px 2px 5px;
`
const Remove = styled.button`
  border: none;
  width: 10px;
  height: 10px;
  justify-self: flex-start;
  align-self: flex-start;
  background: transparent;
  margin: 5px;
  color: #fff;
  visibility: hidden;
  :active: {
    color: red;
    background-color: red;
  }
`

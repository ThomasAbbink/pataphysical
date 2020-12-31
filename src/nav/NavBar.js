import React from 'react'
import NavBarItem from './NavBarItem'
import styled from 'styled-components'

export default () => {
  return (
    <Container>
      <Ul>
        <NavBarItem text="Cube" to="4dcube" />
        <NavBarItem text="Cardioid" to="cardioid" />
        <NavBarItem text="Fourier" to="fourier" />
        <NavBarItem text="Pizza Fourrier" to="pizza-fourrier" />
        <NavBarItem text="SoundSet" to="soundset" />
      </Ul>
    </Container>
  )
}

const Container = styled.div`
  background-color: black;
`

const Ul = styled.ul`
  width: '100%';
  padding: '1rem';
  height: '100vh';
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

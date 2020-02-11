import React, { Component } from 'react'
import NavBarItem from './NavBarItem'
import styled from 'styled-components'

export default class NavBar extends Component {
  render() {
    return (
      <Container>
        <Ul>
          <NavBarItem text="Cube" to="4dcube" />
          <NavBarItem text="Cardioid" to="cardioid" />
        </Ul>
      </Container>
    )
  }
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

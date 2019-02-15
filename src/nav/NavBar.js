import React, { Component } from 'react'
import NavBarItem from './NavBarItem'

export default class NavBar extends Component {
  render() {
    return (
      <div style={{ width: '8rem', backgroundColor: 'black' }}>
        <ul
          style={{
            display: 'flex',
            alignItems: 'left',
            alignContent: 'center',
            width: '100%',
            padding: '1rem',
            flexDirection: 'column',
            height: '100vh'
          }}
        >
          <NavBarItem text="Cube" to="4dcube" />
          <NavBarItem text="Cardioid" to="cardioid" />
        </ul>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class NavBarItem extends Component {
  isActive = () => {
    const url = window.location.href
    return url.substr(url.lastIndexOf('/') + 1) === this.props.to
  }

  render() {
    return (
      <NavLink to={this.props.to}>
        <div
          style={{
            border: '1px solid',
            borderColor: this.isActive() ? 'red' : 'white',
            height: '2rem',
            width: '6rem',
            borderRadius: '0.2rem',
            alignContent: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0.5rem 0'
          }}
        >
          <span style={{ fontFamily: 'HelveticaNeu sans', color: 'white' }}>
            {this.props.text}
          </span>
        </div>
      </NavLink>
    )
  }
}

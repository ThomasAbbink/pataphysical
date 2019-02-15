import React, { Component } from 'react'

export default class NotFoundPage extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
          width: '100%',
          height: '100vh'
        }}
      >
        <span
          style={{
            color: 'white',
            fontFamily: 'HelveticaNeu',
            fontSize: 40,
            textAlign: 'center'
          }}
        >
          Not yet invented
        </span>
      </div>
    )
  }
}

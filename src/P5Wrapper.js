import React from 'react'
import p5 from 'p5'

export class P5Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }
  componentDidMount() {
    this.myP5 = new p5(this.props.sketch, this.ref.current)
  }
  render() {
    return <div ref={this.ref}></div>
  }
}

import React from 'react'
import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

export class P5Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }
  componentDidMount() {
    this.myP5 = new p5(this.props.sketch, this.ref.current)
  }
  componentWillUnmount() {
    console.log('unmounting')
    this.myP5.remove()
  }
  render() {
    return <div ref={this.ref}></div>
  }
}

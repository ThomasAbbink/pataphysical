import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Cube from './geometry/Cube'
import Cardioid from './geometry/Cardioid'
import NavBar from './nav/NavBar'
import NotFoundPage from './nav/NotFoundPage'
import { EtchAVJ } from './EtchAVJ/EtchAVJ'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'black',
          }}
        >
          <NavBar />
          <Switch>
            <Route exact path="/" component={EtchAVJ} />
            <Route exact path="/4dcube" component={Cube} />
            <Route exact path="/cardioid" component={Cardioid} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App

import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Cube from './geometry/Cube'
import Cardioid from './geometry/Cardioid'
import NavBar from './nav/NavBar'
import NotFoundPage from './nav/NotFoundPage'
import { EtchAVJ } from './EtchAVJ/EtchAVJ'
import Fourier from './sound/Fourier'
import PizzaFourrier from './sound/PizzaFourrier'
import SoundSet from './sound/SoundSet'
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
            <Route exact path="/fourier" component={Fourier} />
            <Route exact path="/pizza-fourrier" component={PizzaFourrier} />
            <Route exact path="/soundset" component={SoundSet} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App

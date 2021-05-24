import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Cube from './geometry/Cube'
import Cardioid from './geometry/Cardioid'
import NavBar from './nav/NavBar'
import NotFoundPage from './nav/NotFoundPage'
import EtchAVJ from './EtchAVJ/EtchAVJ'
import Fourier from './sound/Fourier'
import PizzaFourrier from './sound/PizzaFourrier'
import KioskPage from './kiosk/KioskPage'
import styled, { createGlobalStyle } from 'styled-components'
function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Base>
          <NavBar hiddenPathNames={['/kiosk']} />
          <Switch>
            <Route exact path="/" component={EtchAVJ} />
            <Route exact path="/kiosk" component={KioskPage} />
            <Route exact path="/4dcube" component={Cube} />
            <Route exact path="/cardioid" component={Cardioid} />
            <Route exact path="/fourier" component={Fourier} />
            <Route exact path="/pizza-fourrier" component={PizzaFourrier} />
            <Route component={NotFoundPage} />
          </Switch>
        </Base>
      </BrowserRouter>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`

const Base = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  width: 100%;
`

export default App

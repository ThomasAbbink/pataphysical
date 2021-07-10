import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NotFoundPage from './nav/NotFoundPage'
import KioskPage from './pages/kiosk/KioskPage'
import styled, { createGlobalStyle } from 'styled-components'
import Portraits from './sketches/generative/image-rendering/render-image'

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Base>
          <Switch>
            <Route exact path="/" component={KioskPage} />
            <Route exact path="/portraits" component={Image} />
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

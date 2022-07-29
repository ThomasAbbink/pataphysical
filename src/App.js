import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFoundPage from './nav/NotFoundPage'
import KioskPage from './pages/kiosk/KioskPage'
import CarouselPage from './pages/carousel/CarouselPage'
import styled, { createGlobalStyle } from 'styled-components'
import { backgroundColor } from './style/colors'

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Base>
          <Routes>
            <Route path="/" element={<CarouselPage />}></Route>
            <Route path="index.html" element={<CarouselPage />}></Route>
            <Route path="/kiosk" element={<KioskPage />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
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
  background-color: ${backgroundColor};
`

export default App

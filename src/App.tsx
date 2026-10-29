import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFoundPage from './nav/NotFoundPage'
import KioskPage from './pages/kiosk/KioskPage'
import CarouselPage from './pages/carousel/CarouselPage'
import SketchPage from './pages/sketch/SketchPage'
import styled, { createGlobalStyle } from 'styled-components'
import { backgroundColor } from './style/colors'
import PrivacyPolicy from './pages/pricacy-policy/PrivacyPolicy'

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Base>
          <Routes>
            <Route path="/" element={<CarouselPage />}></Route>
            <Route path="/kiosk" element={<KioskPage />}></Route>
            <Route path="/sketch/:name" element={<SketchPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path="tmp"
              element={
                <div>
                  <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Montenegrin+Gothic+One&display=swap');
                  h1 { 
                    font-size: 12rem; 
                    color: black; 
                    background:none;
                    font-family: "Montenegrin Gothic One", serif;
                    font-weight: 700;
                    font-style: normal;

                    } & div {background: white; padding: 2rem; display: flex; justify-content:center; align-items:center; flex-grow: 1; height: 15rem; width: 100vw;}`}</style>

                  <h1>Pataphysical</h1>
                </div>
              }
            />
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

const TmpText = styled.h1`
  font-size: 20rem;
  font-weight: bold;
`

export default App

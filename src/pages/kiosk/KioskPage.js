import React from 'react'
import Cube from '../../sketches/geometry/Cube'
import Cardioid from '../../sketches/geometry/Cardioid'
import PizzaFourier from '../../sketches/sound/PizzaFourrier'
import Kiosk from './Kiosk'
import EtchAVJ from '../../sketches/EtchAVJ/EtchAVJ'

export default function KioskPage() {
  return (
    <Kiosk>
      <Cube />
      <Cardioid />
      <PizzaFourier />
      <EtchAVJ />
    </Kiosk>
  )
}

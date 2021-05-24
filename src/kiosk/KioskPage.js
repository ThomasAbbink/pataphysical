import React from 'react'
import Cube from '../geometry/Cube'
import Cardioid from '../geometry/Cardioid'
import PizzaFourier from '../sound/PizzaFourrier'
import Kiosk from './Kiosk'
import EtchAVJ from '../EtchAVJ/EtchAVJ'

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

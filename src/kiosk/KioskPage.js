import React from 'react'
import Cube from '../geometry/Cube'
import Cardioid from '../geometry/Cardioid'
import PizzaFourier from '../sound/PizzaFourrier'
import Kiosk from './Kiosk'

export default function KioskPage() {
  return <Kiosk sketches={[Cube, Cardioid, PizzaFourier]} />
}

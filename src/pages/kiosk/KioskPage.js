import React from 'react'
import Cube from '../../sketches/geometry/Cube'
import Cardioid from '../../sketches/geometry/Cardioid'
import PizzaFourier from '../../sketches/sound/PizzaFourrier'
import Kiosk from './Kiosk'
import EtchAVJ from '../../sketches/EtchAVJ/EtchAVJ'
import PollockLines from '../../sketches/generative/PollockLines'
export default function KioskPage() {
  return (
    <Kiosk>
      <PollockLines />
      <Cube />
      <Cardioid />
      <PizzaFourier />
      <EtchAVJ />
    </Kiosk>
  )
}

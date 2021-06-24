import React from 'react'
import Cube from '../../sketches/geometry/Cube'
import Cardioid from '../../sketches/geometry/Cardioid'
import PizzaFourier from '../../sketches/sound/PizzaFourrier'
import Kiosk from './Kiosk'
import EtchAVJ from '../../sketches/EtchAVJ/EtchAVJ'
import PollockLines from '../../sketches/generative/PollockLines'
import PollockAreas from '../../sketches/generative/PollockAreas/PollockAreas'

export default function KioskPage() {
  return (
    <Kiosk>
      <PollockAreas />
      <PollockLines />
      <Cube />
      <Cardioid />
      <EtchAVJ />
      <PizzaFourier />
    </Kiosk>
  )
}

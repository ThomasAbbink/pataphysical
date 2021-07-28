import React from 'react'
import Cube from '../../sketches/geometry/Cube'
import Cardioid from '../../sketches/geometry/Cardioid'
import PizzaFourier from '../../sketches/sound/PizzaFourrier'
import Carousel from './Carousel'
import EtchAVJ from '../../sketches/EtchAVJ/EtchAVJ'
import PollockLines from '../../sketches/generative/PollockLines'
import PollockAreas from '../../sketches/generative/PollockAreas/PollockAreas'
import PollockClock from '../../sketches/generative/clock/clock'
import Portraits from '../../sketches/generative/image-rendering/render-image'

export default function KioskPage() {
  return (
    <Carousel>
      <Portraits />
      <PollockClock />
      <PollockAreas />
      <PollockLines />
      <Cube />
      <Cardioid />
      <EtchAVJ />
      <PizzaFourier />
    </Carousel>
  )
}

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
import Matrix from '../../sketches/generative/matrix/matrix'
import MatrixCli from '../../sketches/generative/matrix/matrix-cli'

export default function KioskPage() {
  return (
    <Carousel>
      <Matrix />
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

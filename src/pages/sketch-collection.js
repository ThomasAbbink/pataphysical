import React from 'react'
import Cube from '../sketches/geometry/Cube'
import Cardioid from '../sketches/geometry/Cardioid'
import PizzaFourier from '../sketches/sound/PizzaFourrier'
import EtchAVJ from '../sketches/EtchAVJ/EtchAVJ'
import PollockLines from '../sketches/generative/PollockLines'
import PollockAreas from '../sketches/generative/PollockAreas/PollockAreas'
import PollockClock from '../sketches/generative/clock/clock'
import Portraits from '../sketches/generative/image-rendering/render-image'
import Matrix from '../sketches/generative/matrix/matrix'
import LotusCircles from '../sketches/generative/lotus-circles/LotusCircles'

export default function sketchCollection() {
  return [
    <LotusCircles />,
    <Matrix />,
    <Portraits />,
    <PollockClock />,
    <PollockAreas />,
    <PollockLines />,
    <Cube />,
    <Cardioid />,
    <EtchAVJ />,
    <PizzaFourier />,
  ]
}

import React from 'react'
import Cube from '../sketches/geometry/Cube'
import Cardioid from '../sketches/geometry/Cardioid'
import PollockLines from '../sketches/generative/PollockLines'
import PollockAreas from '../sketches/generative/PollockAreas/PollockAreas'
import PollockClock from '../sketches/generative/clock/clock'
import Portraits from '../sketches/generative/image-rendering/render-image'
import Matrix from '../sketches/generative/matrix/matrix'
import LotusCircles from '../sketches/generative/lotus-circles/LotusCircles'

export default function sketchCollection() {
  return [
    <LotusCircles key="lotus" />,
    <Matrix key="matrix" />,
    <Portraits key="portraits" />,
    <PollockClock key="clock" />,
    <PollockAreas key="areas" />,
    <PollockLines key="lines" />,
    <Cube key="cube" />,
    <Cardioid key="cardioid" />,
  ]
}

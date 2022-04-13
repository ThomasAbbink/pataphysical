import React from 'react'
import Cardioid from '../sketches/geometry/Cardioid'
import PollockLines from '../sketches/generative/PollockLines'
import PollockAreas from '../sketches/generative/PollockAreas/PollockAreas'
import PollockClock from '../sketches/generative/clock/clock'
import Portraits from '../sketches/generative/image-rendering/render-image'
import Matrix from '../sketches/generative/matrix/matrix'
import LotusCircles from '../sketches/generative/lotus-circles/LotusCircles'
import ManyCircles from '../sketches/generative/many-circles/ManyCircles'
import RepulsionAttraction from '../sketches/generative/grid-forces/repulsion-attraction'

export default function sketchCollection() {
  return [
    <RepulsionAttraction key="repulsion-attraction" />,
    <ManyCircles key="many-circles" />,
    <LotusCircles key="lotus" />,
    <Matrix key="matrix" />,
    <Portraits key="portraits" />,
    <PollockClock key="clock" />,
    <PollockAreas key="areas" />,
    <PollockLines key="lines" />,
    <Cardioid key="cardioid" />,
  ]
}

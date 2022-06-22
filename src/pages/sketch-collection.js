import Cardioid from '../sketches/geometry/Cardioid'
import PollockLines from '../sketches/generative/PollockLines'
import PollockAreas from '../sketches/generative/PollockAreas/PollockAreas'
import PollockClock from '../sketches/generative/clock/clock'
import Portraits from '../sketches/generative/image-rendering/render-image'
import Matrix from '../sketches/generative/matrix/matrix'
import LotusCircles from '../sketches/generative/lotus-circles/LotusCircles'
import ManyCircles from '../sketches/generative/many-circles/ManyCircles'
import RepulsionAttraction from '../sketches/generative/grid-forces/repulsion-attraction'
import Cube from '../sketches/geometry/Cube'
import TruchetTiles from '../sketches/generative/truchet-tiles/truchet-tiles'
import TruchetTiles2 from '../sketches/generative/truchet-tiles/truchet-tiles-2'
import TruchetTiles3 from '../sketches/generative/truchet-tiles/truchet-tiles-3'
import WavyCircle from '../sketches/generative/wavy-circle'
import WavyAnemone from '../sketches/generative/wavy-anemone'
import SunnyTunnel from '../sketches/generative/sunny-tunnel'

export default function sketchCollection() {
  return [
    <SunnyTunnel key="sunny-tunnel" />,
    <WavyAnemone key="wavy-anemone" />,
    <WavyCircle key="wavy-circle" />,
    <TruchetTiles3 key="truchet-tiles-3" />,
    <TruchetTiles2 key="truchet-tiles-2" />,
    <TruchetTiles key="truchet-tiles" />,
    <RepulsionAttraction key="repulsion-attraction" />,
    <ManyCircles key="many-circles" />,
    <LotusCircles key="lotus" />,
    <Matrix key="matrix" />,
    <Portraits key="portraits" />,
    <PollockClock key="clock" />,
    <PollockAreas key="areas" />,
    <PollockLines key="lines" />,
    <Cardioid key="cardioid" />,
    <Cube key="cube" />,
  ]
}

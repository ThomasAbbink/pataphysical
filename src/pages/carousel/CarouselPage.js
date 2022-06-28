import Carousel from './Carousel'
import * as sketches from '../../sketches'

export default function CarouselPage() {
  return <Carousel sketches={Object.values(sketches)} />
}

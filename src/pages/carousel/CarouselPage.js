import Carousel from './Carousel'
import sketchCollection from '../sketch-collection'

export default function CarouselPage() {
  return <Carousel>{sketchCollection()}</Carousel>
}

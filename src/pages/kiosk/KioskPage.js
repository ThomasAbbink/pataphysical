import Kiosk from './Kiosk'
import sketchCollection from '../sketch-collection'

export default function KioskPage() {
  return <Kiosk>{sketchCollection()}</Kiosk>
}

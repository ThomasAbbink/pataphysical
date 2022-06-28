import Kiosk from './Kiosk'
import * as sketches from '../../sketches'

export default function KioskPage() {
  return <Kiosk sketches={Object.values(sketches)}></Kiosk>
}

import Kiosk from '../kiosk/Kiosk'
import { Sketch } from '../../types/Sketch'
import {
  paintingBlink,
  paintingWebcam,
  rdBlob,
  wavyCircle,
  jfaVoronoiFbm,
  fractalTree,
} from '../../sketches'

// Selection of sketches for BYOB, shown in kiosk mode in this order.
const byobSketches: Sketch[] = [
  paintingBlink,
  paintingWebcam,
  rdBlob,
  wavyCircle,
  fractalTree,
  jfaVoronoiFbm,
]

export default function ByobPage() {
  if (byobSketches.length === 0) return null
  return <Kiosk
      sketches={byobSketches}
      timeout={45000}
      breakoutSketch={paintingWebcam}
    />
}

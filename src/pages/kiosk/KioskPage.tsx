import Kiosk from './Kiosk'
import * as sketches from '../../sketches'

export default function KioskPage() {
  return (
    <Kiosk
      sketches={Object.values(sketches).sort((a, b) =>
        b.date.localeCompare(a.date),
      )}
    />
  )
}

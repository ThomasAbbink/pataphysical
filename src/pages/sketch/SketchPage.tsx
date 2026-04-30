import { useParams } from 'react-router-dom'
import * as sketches from '../../sketches'
import NotFoundPage from '../../nav/NotFoundPage'
import KioskSketchWrapper from '../kiosk/KioskSketchWrapper'

export default function SketchPage() {
  const { name } = useParams<{ name: string }>()
  const sketch = Object.values(sketches).find((s) => s.name === name)

  if (!sketch) return <NotFoundPage />

  return <KioskSketchWrapper sketch={sketch} />
}

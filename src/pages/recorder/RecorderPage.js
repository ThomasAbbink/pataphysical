import Recorder from './Recorder'
import * as sketches from '../../sketches'

export default function RecorderPage() {
  return <Recorder sketches={Object.values(sketches)} />
}

import { useEffect, useState } from 'react'
import { endRecordingAndDownloadVideo } from '../utility/record-canvas'

export const SketchRecorder = ({ p5 }) => {
  const drawRef = useRef()
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    loadEncoder({ width: p5.width, height: p5.height })
    drawRef.current = p5ref.current.draw

    p5.draw = () => {
      if (isRecording) {
        recordFrame()
      }
      drawRef.current()
    }
  }, [isRecording])

  const onClickRecord = () => {
    if (isRecording) {
      endRecordingAndDownloadVideo()
      setIsRecording(false)
    } else {
      setIsRecording(true)
    }
  }

  return <button onClick={onClickRecord}>record</button>
}

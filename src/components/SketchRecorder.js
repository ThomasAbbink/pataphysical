import { useEffect, useState, useRef } from 'react'
import {
  endRecordingAndDownloadVideo,
  loadEncoder,
  recordFrame,
} from '../utility/record-canvas'
import styled from 'styled-components'

export const SketchRecorder = ({ p5, bleep }) => {
  const drawRef = useRef()
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    if (isRecording) {
      const { width, height } = p5.current
      const w = width - (width % 2)
      const h = height - (height % 2)

      loadEncoder({ width: w, height: h }).then(() => {
        drawRef.current = p5.current.draw

        p5.current.draw = () => {
          recordFrame(p5.current)
          drawRef.current()
        }
      })
      return () => {
        p5.current.draw = drawRef.current
        endRecordingAndDownloadVideo()
      }
    }
  }, [isRecording])

  const onClickRecord = () => {
    setIsRecording(!isRecording)
  }

  return <Botton onClick={onClickRecord}>record</Botton>
}

const Botton = styled.button`
  position: absolute;
`

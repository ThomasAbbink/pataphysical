import * as HME from 'h264-mp4-encoder'
import p5 from 'p5'

let encoder: HME.H264MP4Encoder
export const loadEncoder = async ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  return HME.createH264MP4Encoder().then((enc) => {
    encoder = enc
    encoder.outputFilename = 'test'
    encoder.width = width
    encoder.height = height
    encoder.frameRate = 60
    encoder.kbps = 10000 // video quality
    encoder.groupOfPictures = 10 // lower if you have fast actions.
    encoder.initialize()
  })
}

export const recordFrame = (p5: p5) => {
  encoder.addFrameRgba(
    p5.drawingContext.getImageData(0, 0, encoder.width, encoder.height).data,
  )
}

export const endRecordingAndDownloadVideo = () => {
  encoder.finalize()
  const uint8Array = encoder.FS.readFile(encoder.outputFilename)
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(
    new Blob([uint8Array], { type: 'video/mp4' }),
  )
  anchor.download = encoder.outputFilename
  anchor.click()
  encoder.delete()
}

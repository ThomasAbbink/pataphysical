import * as HME from 'h264-mp4-encoder'

let encoder
export const loadEncoder = async ({ width, height }) => {
  return HME.createH264MP4Encoder().then((enc) => {
    encoder = enc
    encoder.outputFilename = 'test'
    encoder.width = width
    encoder.height = height
    encoder.frameRate = 60
    encoder.kbps = 50000 // video quality
    encoder.groupOfPictures = 10 // lower if you have fast actions.
    encoder.initialize()
  })
}

export const recordFrame = () => {
  encoder.addFrameRgba(
    p5.drawingContext.getImageData(0, 0, encoder.width, encoder.height).data,
  )
}

export const endRecordingAndDownloadVideo = () => {
  isRecording = false
  encoder.finalize()
  const uint8Array = encoder.FS.readFile(encoder.outputFilename)
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(
    new Blob([uint8Array], { type: 'video/mp4' }),
  )
  anchor.download = encoder.outputFilename
  anchor.click()
  encoder.delete()
  p5.preload()
}

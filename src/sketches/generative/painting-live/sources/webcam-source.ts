import { PaintSource, PaintSourceFactory } from './source-types'

type WebcamSourceOptions = {
  // ms between published frames
  interval: number
  // Flip horizontally, so it reads like a mirror
  mirror?: boolean
}

export const webcamSource =
  ({ interval, mirror = true }: WebcamSourceOptions): PaintSourceFactory =>
  (): PaintSource => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    // Painting reads from this copy, so every frame it ingests is stable
    const output = document.createElement('canvas')
    const outputContext = output.getContext('2d')!
    let stream: MediaStream | null = null
    let timer: ReturnType<typeof setInterval> | undefined
    let version = 0
    let removed = false

    const stopStream = () => {
      stream?.getTracks().forEach((track) => track.stop())
      stream = null
    }

    const capture = () => {
      if (video.readyState < video.HAVE_CURRENT_DATA) return
      const { videoWidth: w, videoHeight: h } = video
      if (!w || !h) return
      if (output.width !== w || output.height !== h) {
        output.width = w
        output.height = h
      }
      outputContext.save()
      if (mirror) {
        outputContext.translate(w, 0)
        outputContext.scale(-1, 1)
      }
      outputContext.drawImage(video, 0, 0, w, h)
      outputContext.restore()
      version++
    }

    return {
      start: async ({ width, height }, display) => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: width },
              height: { ideal: height },
            },
            audio: false,
          })
        } catch (error) {
          // Denied, no camera, or not a secure context: painting stays idle
          console.warn('webcamSource: no camera stream', error)
          return
        }
        // Removed while the permission prompt was open
        if (removed) {
          stopStream()
          return
        }

        video.srcObject = stream
        await video.play()

        if (display) {
          Object.assign(video.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: mirror ? 'scaleX(-1)' : '',
          })
          display.appendChild(video)
        }

        capture()
        timer = setInterval(capture, interval)
      },
      frame: () => (version > 0 ? output : null),
      version: () => version,
      remove: () => {
        removed = true
        clearInterval(timer)
        stopStream()
        video.srcObject = null
        video.remove()
      },
    }
  }

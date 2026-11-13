import { PaintSource, PaintSourceFactory } from './source-types'

type ImageSourceOptions = {
  interval: number
}

export type ImageStep = { path: string; duration: number }

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export const imageSource =
  (
    entries: (string | ImageStep)[],
    { interval }: ImageSourceOptions,
  ): PaintSourceFactory =>
  (): PaintSource => {
    const steps: ImageStep[] = entries.map((entry) =>
      typeof entry === 'string' ? { path: entry, duration: interval } : entry,
    )
    let images: HTMLImageElement[] = []
    let current: HTMLImageElement | null = null
    let index = 0
    let version = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let removed = false
    let preview: HTMLImageElement | null = null

    const show = (i: number) => {
      current = images[i]
      if (preview) preview.src = current.src
      version++
    }

    const scheduleNext = () => {
      timer = setTimeout(() => {
        index = (index + 1) % steps.length
        show(index)
        scheduleNext()
      }, steps[index].duration)
    }

    return {
      start: async (_size, display) => {
        // Preload everything, so short steps (a blink) switch instantly
        images = await Promise.all(steps.map((step) => loadImage(step.path)))
        if (removed) return

        if (display) {
          preview = document.createElement('img')
          Object.assign(preview.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          })
          display.appendChild(preview)
        }
        show(index)
        if (steps.length > 1) scheduleNext()
      },
      frame: () => current,
      version: () => version,
      remove: () => {
        removed = true
        clearTimeout(timer)
        preview?.remove()
      },
    }
  }

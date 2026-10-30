import { PaintSource, PaintSourceFactory } from './source-types'

type ImageSourceOptions = {
  // ms between switching to the next image
  interval: number
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export const imageSource =
  (paths: string[], { interval }: ImageSourceOptions): PaintSourceFactory =>
  (): PaintSource => {
    const cache = new Map<string, HTMLImageElement>()
    let current: HTMLImageElement | null = null
    let index = 0
    let version = 0
    let timer: ReturnType<typeof setInterval> | undefined
    let removed = false
    let preview: HTMLImageElement | null = null

    const show = async (i: number) => {
      const path = paths[i]
      let img = cache.get(path)
      if (!img) {
        img = await loadImage(path)
        cache.set(path, img)
      }
      if (removed) return
      current = img
      if (preview) preview.src = img.src
      version++
    }

    return {
      start: async (_size, display) => {
        if (display) {
          preview = document.createElement('img')
          Object.assign(preview.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          })
          display.appendChild(preview)
        }
        await show(index)
        if (removed || paths.length < 2) return
        timer = setInterval(() => {
          index = (index + 1) % paths.length
          show(index)
        }, interval)
      },
      frame: () => current,
      version: () => version,
      remove: () => {
        removed = true
        clearInterval(timer)
        preview?.remove()
      },
    }
  }

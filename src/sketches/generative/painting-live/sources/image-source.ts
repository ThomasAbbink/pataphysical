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

    const show = async (i: number) => {
      const path = paths[i]
      let img = cache.get(path)
      if (!img) {
        img = await loadImage(path)
        cache.set(path, img)
      }
      if (removed) return
      current = img
      version++
    }

    return {
      start: async () => {
        await show(index)
        if (paths.length < 2) return
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
      },
    }
  }

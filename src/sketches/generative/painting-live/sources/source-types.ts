export type SourceFrame = HTMLImageElement | HTMLCanvasElement | ImageBitmap

export type SourceSize = { width: number; height: number }

export type PaintSource = {
  start: (size: SourceSize) => Promise<void>
  frame: () => SourceFrame | null
  version: () => number
  remove: () => void
}

export type PaintSourceFactory = () => PaintSource

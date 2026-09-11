import p5js from 'p5'

export type StrokeMapAssset = {
  name: string
  sheet: number
  col: number
  row: number
  box: number[]
  lengthPx: number
  widthPx: number
  aspect: number
}
export type StokeMap = {
  tileWidth: number
  tileHeight: number
  cols: number
  rows: number
  count: number
  scale: number
  strokes: StrokeMapAssset[]
}
export type Stroke = {
  points: StrokePoint[]
  totalArc?: number
  color: p5js.Vector
  progress: number
  speed: number
  strokeMapAsset: StrokeMapAssset
}

export type StrokePoint = {
  anchor: p5js.Vector
  normal: p5js.Vector
  s: number
  halfWidth: number
}

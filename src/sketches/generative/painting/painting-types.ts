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

export type State = {
  currentStroke: number
  radius: number
  lastBlurRadius: number
  speedModifier: number
  lastRefresh: number
}

export const INITIAL_STATE: State = {
  currentStroke: 0,
  radius: 30,
  lastBlurRadius: 20,
  speedModifier: 1,
  lastRefresh: 0,
}

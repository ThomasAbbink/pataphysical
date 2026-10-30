import { makePainting } from './painting-live'
import { imageSource } from './sources/image-source'
import { sketchSource } from './sources/sketch-source'
import { webcamSource } from './sources/webcam-source'
import { rdBlob } from '../rd-blob/rd-blob'
import { sinelines } from '../sinelines'

export const paintingSinelines = makePainting(
  'paintingSinelines',
  '2026-10-30',
  {
    source: sketchSource(sinelines, {
      interval: 50,
      scale: 1,
      warmupFrames: 10,
    }),
    refreshBump: 0,
    showSource: true,
  },
)

export const paintingRdBlob = makePainting('paintingRdBlob', '2026-10-29', {
  source: sketchSource(rdBlob, {
    interval: 500,
    scale: 1,
    warmupFrames: 10,
  }),
  refreshBump: 0.01,
  showSource: true,
})

export const paintingWebcam = makePainting('paintingWebcam', '2026-10-30', {
  source: webcamSource({ interval: 1000 }),
  refreshBump: 0.01,
  showSource: false,
})

export const paintingImages = makePainting('paintingImages', '2026-10-29', {
  source: imageSource(
    [
      'assets/pata-title-text.png',
      'assets/tree_water.jpg',
      'assets/jungle_mountain.webp',
      'assets/mountain_river.webp',
      '/assets/infi/bug.jpg',
      '/assets/infi/space-invader.jpg',
    ],
    { interval: 30000 },
  ),
  refreshBump: 1,
  showSource: true,
})

import { makePainting } from './painting-live'
import { imageSource } from './sources/image-source'
import { webcamSource } from './sources/webcam-source'

export const paintingWebcam = makePainting('paintingWebcam', '2026-10-30', {
  source: webcamSource({ interval: 1000 }),
  refreshBump: 0.01,
  showSource: false,
})

export const paintingBlink = makePainting('paintingBlink', '2026-11-12', {
  source: imageSource(
    [
      { path: 'assets/eye/serious.jpg', duration: 12_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 3_000 },
      { path: 'assets/eye/serious-red.jpg', duration: 1_000 },
      { path: 'assets/eye/serious-green.jpg', duration: 1_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 3_000 },
    ],
    { interval: 30_000 },
  ),
  refreshBump: 0.2,
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

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
      { path: 'assets/eye/serious-iris-blue-4x.png', duration: 12_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 3_000 },
      { path: 'assets/eye/happy-iris-blue-4x.png', duration: 6_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 2_000 },
      { path: 'assets/eye/serious-chip-4x.png', duration: 6_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 3_000 },

      { path: 'assets/eye/serious-iris-blue-4x.png', duration: 5_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 2_000 },
      { path: 'assets/eye/happy-iris-blue-4x.png', duration: 5_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 2_000 },
      { path: 'assets/eye/serious-chip-4x.png', duration: 5_000 },
      { path: 'assets/eye/closed-tight.jpg', duration: 2_000 },
    ],
    { interval: 30_000 },
  ),
  refreshBump: 0.4,
  showSource: false,
})
export const paintingMolen = makePainting('paintingMolen', '2026-11-12', {
  source: imageSource(
    [
      { path: 'assets/molen-b&w.jpeg', duration: 12_000 },
      { path: 'assets/molen-color.jpeg', duration: 12_000 },
    ],
    { interval: 30_000 },
  ),
  refreshBump: 0.4,
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

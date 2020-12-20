export default [
  { name: 'dot', vectors: () => [{ x: 0, y: 0 }] },
  {
    name: 'triangle',
    vectors: () => [
      { x: 100, y: -100 },
      { x: 0, y: 100 },
      { x: -100, y: -100 },
      { x: 100, y: -100 },
    ],
  },
  {
    name: 'square',
    vectors: () => [
      { x: 100, y: 100 },
      { x: -100, y: 100 },
      { x: -100, y: -100 },
      { x: 100, y: -100 },
      { x: 100, y: 100 },
    ],
  },
  {
    name: 'star',
    vectors: () => [
      { x: 0, y: -100 },
      { x: 0.3 * 100, y: -(0.3 * 100) },
      { x: 100, y: 0 },
      { x: 0.3 * 100, y: 0.3 * 100 },
      { x: 0, y: 100 },
      { x: -(0.3 * 100), y: 0.3 * 100 },
      { x: -100, y: 0 },
      { x: -(0.3 * 100), y: -(0.3 * 100) },
      { x: 0, y: -100 },
    ],
  },
  {
    name: 'octagon',
    vectors: () => [
      { x: 0, y: -100 },
      { x: 0.66 * 100, y: -(0.66 * 100) },
      { x: 100, y: 0 },
      { x: 0.66 * 100, y: 0.66 * 100 },
      { x: 0, y: 100 },
      { x: -(0.66 * 100), y: 0.66 * 100 },
      { x: -100, y: 0 },
      { x: -(0.66 * 100), y: -(0.66 * 100) },
      { x: 0, y: -100 },
    ],
  },
  {
    name: 'complex octagon',
    vectors: () => {
      let shape = []
      for (let i = 0; i < 8; i++) {
        const f = 0.33 * i
        shape = [
          ...shape,
          { x: 0, y: -100 },
          { x: f * 100, y: -(f * 100) },
          { x: 100, y: 0 },
          { x: f * 100, y: f * 100 },
          { x: 0, y: 100 },
          { x: -(f * 100), y: f * 100 },
          { x: -100, y: 0 },
          { x: -(f * 100), y: -(f * 100) },
          { x: 0, y: -100 },
        ]
      }
      return shape
    },
  },
  {
    name: 'square web',
    vectors: () => {
      let shape = []
      for (let i = 1; i < 8; i++) {
        const w = (100 / 4) * i
        const h = w
        shape = [
          ...shape,
          { x: 0, y: -h },
          { x: w, y: 0 },
          { x: 0, y: h },
          { x: -w, y: 0 },
          { x: w, y: 0 },
          { x: -w, y: 0 },
          { x: 0, y: -h },
          { x: 0, y: h },
          { x: 0, y: -h },
        ]
      }
      return shape
    },
  },
  {
    name: 'triangles',
    vectors: () => {
      let shape = []
      for (let i = 8; i > 0; i--) {
        const s = (100 / 4) * i
        const s2 = s / 2
        shape = [
          ...shape,
          { x: s, y: -s },
          { x: 0, y: s },
          { x: -s, y: -s },
          { x: s2, y: -s2 },
          { x: 0, y: s2 },
          { x: -s2, y: -s2 },
          { x: s, y: -s },
        ]
      }
      return shape
    },
  },
]

const blueGreen = [
  { rgb: [111, 88, 201] },
  { rgb: [126, 120, 210] },
  { rgb: [182, 184, 214] },
  { rgb: [187, 219, 209] },
  { rgb: [189, 237, 224] },
  { rgb: [20, 35, 55] },
]

const coralViolet = [
  { rgb: [255, 132, 132] },
  { rgb: [35, 116, 171] },
  { rgb: [77, 204, 189] },
  { rgb: [35, 22, 81] },
  { rgb: [214, 255, 246] },
]

const vermillionPrussian = [
  { rgb: [29, 51, 84] },
  { rgb: [70, 117, 153] },
  { rgb: [158, 216, 219] },
  { rgb: [233, 255, 249] },
  { rgb: [214, 64, 69] },
]

const oliveOrange = [
  { rgb: [55, 55, 31] },
  { rgb: [234, 144, 16] },
  { rgb: [144, 190, 109] },
  { rgb: [201, 227, 172] },
  { rgb: [234, 239, 189] },
]
const crayolaTomato = [
  {
    name: 'Violet Blue Crayola',
    rgb: [119, 118, 188],
  },
  {
    name: 'Languid Lavender',
    rgb: [205, 199, 229],
  },
  {
    name: 'Light Yellow',
    rgb: [255, 251, 219],
  },
  {
    name: 'Corn',
    rgb: [255, 236, 81],
  },
  {
    name: 'Tomato',
    rgb: [255, 103, 77],
  },
]

const citronRust = [
  {
    name: 'Citron',
    rgb: [142, 166, 4],
  },
  {
    name: 'Orange Yellow',
    rgb: [245, 187, 0],
  },
  {
    name: 'Marigold',
    rgb: [236, 159, 5],
  },
  {
    name: 'Chocolate Web',
    rgb: [215, 106, 3],
  },
  {
    name: 'Rust',
    rgb: [191, 49, 0],
  },
]
const raisinCyan = [
  {
    name: 'Raisin Black',
    rgb: [42, 45, 52],
  },
  {
    name: 'Carolina Blue',
    rgb: [0, 157, 220],
  },
  {
    name: 'Orange Pantone',
    rgb: [242, 100, 48],
  },
  {
    name: 'Dark Blue Gray',
    rgb: [103, 97, 168],
  },
  {
    name: 'Green Cyan',
    rgb: [0, 155, 114],
  },
]

const mikadoPrinceton = [
  {
    name: 'Green Blue',
    rgb: [35, 100, 170],
  },
  {
    name: 'Carolina Blue',
    rgb: [61, 165, 217],
  },
  {
    name: 'Green Sheen',
    rgb: [115, 191, 184],
  },
  {
    name: 'Mikado Yellow',
    rgb: [254, 198, 1],
  },
  {
    name: 'Princeton Orange',
    rgb: [234, 115, 23],
  },
]

const manateeForest = [
  {
    name: 'Manatee',
    rgb: [139, 148, 163],
  },
  {
    name: 'Aquamarine',
    rgb: [140, 251, 222],
  },
  {
    name: 'Medium Spring Green',
    rgb: [15, 255, 149],
  },
  {
    name: 'Medium Sea Green',
    rgb: [6, 186, 99],
  },
  {
    name: 'Forest Green Traditional',
    rgb: [16, 57, 0],
  },
]
const crayolaCadmium = [
  {
    name: 'Green Blue Crayola',
    rgb: [30, 145, 214],
  },
  {
    name: 'French Blue',
    rgb: [0, 114, 187],
  },
  {
    name: 'Yellow Green',
    rgb: [143, 201, 58],
  },
  {
    name: 'Citrine',
    rgb: [228, 204, 55],
  },
  {
    name: 'Cadmium Orange',
    rgb: [225, 131, 53],
  },
]

const spaceIndependence = [
  {
    name: 'Space Cadet',
    rgb: [45, 49, 66],
  },
  {
    name: 'Silver',
    rgb: [191, 192, 192],
  },
  {
    name: 'White',
    rgb: [255, 255, 255],
  },
  {
    name: 'Mandarin',
    rgb: [239, 131, 84],
  },
  {
    name: 'Independence',
    rgb: [79, 93, 117],
  },
]

const redWhite = [
  {
    name: 'Red Crayola',
    rgb: [255, 16, 83],
  },
  {
    name: 'Dark Blue Gray',
    rgb: [108, 110, 160],
  },
  {
    name: 'Vivid Sky Blue',
    rgb: [102, 199, 244],
  },
  {
    name: 'Beau Blue',
    rgb: [193, 202, 214],
  },
  {
    name: 'White',
    rgb: [255, 255, 255],
  },
]
const palettes = [
  manateeForest,
  crayolaTomato,
  oliveOrange,
  vermillionPrussian,
  coralViolet,
  blueGreen,
  citronRust,
  raisinCyan,
  mikadoPrinceton,
  redWhite,
  spaceIndependence,
  crayolaCadmium,
]
const alpha = 80

const rgbToColor = (p5) => (c) => p5.color(...[...c.rgb, alpha])
const mapPaletteToColors = (p5) => (color) => {
  return rgbToColor(p5)(color)
}

export const getPalette = (p5) => {
  return p5.random(palettes).map(mapPaletteToColors(p5))
}

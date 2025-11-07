export type Cell = Hex & {
  value: 0 | 1 | 2 | 3 | 4 | 5 | null
  isInShade: boolean
  isNewSeed?: boolean
  isInLenslight?: boolean
  color: [number, number, number]
}

export type Hex = {
  column: number
  row: number
}

export const solarLocations = ['north', 'east', 'south', 'west']

export type SolarLocation = (typeof solarLocations)[number]

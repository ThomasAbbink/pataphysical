import { HexgGrid } from './hexgrid'
import { Cell, SolarLocation, solarLocations } from './types'

export function parse(input: string) {
  const lines = input.split('\n')
  const res = lines.map((line, index) => {
    if (index === 0 || index === lines.length - 1) return null

    const cells = line
      .split('/')
      .filter(Boolean)
      .filter((_, x) => {
        if (index % 2 === 0 && x === 0) {
          return false
        }
        return true
      })
      .map((cell, x) => {
        const value = cell.match(/[0-9]/)
        const column = x * 2 + ((index - 1) % 2)
        const row = index - 1

        return {
          value: value ? (Number(value) as Cell['value']) : null,
          column,
          row,
          isInShade: false,
          color: [0, 0, 0],
        }
      })
    return cells
  })

  return res.filter(Boolean).flat() as Cell[]
}

export function partOne(input: Cell[]) {
  const grid = new HexgGrid(input)
  const generations = 256
  let totalHarvest = 0
  let solarLocation: SolarLocation = 'north'
  for (let i = 0; i < generations; i++) {
    const harvestCount = doDay(grid, solarLocation, false)

    grid.reset()
    totalHarvest += harvestCount
    solarLocation = nextSolarLocation(solarLocation)
  }

  return totalHarvest
}

export function doDay(
  grid: HexgGrid,
  solarLocation: SolarLocation,
  addLenses: boolean = false,
): number {
  grid.throwShade(solarLocation)

  if (addLenses) {
    grid.addLenses(solarLocation)
  }

  grid.plantSeeds()

  grid.grow()
  const count = grid.harvest()

  return count
}

export function partTwo(input: Cell[]) {
  console.time('partTwo')
  const grid = new HexgGrid(input)
  const generations = 256
  let totalHarvest = 0
  let solarLocation: SolarLocation = 'north'
  for (let i = 0; i < generations; i++) {
    const harvestCount = doDay(grid, solarLocation, true)

    grid.reset()
    totalHarvest += harvestCount
    solarLocation = nextSolarLocation(solarLocation)
  }
  console.timeEnd('partTwo')
  return totalHarvest
}

function nextSolarLocation(location: SolarLocation): SolarLocation {
  return solarLocations[
    (solarLocations.indexOf(location) + 1) % solarLocations.length
  ]
}

import { Cell, Hex, SolarLocation } from './types'

export class HexgGrid {
  public cells: Cell[]
  public size: number

  constructor(cells: Cell[]) {
    this.cells = cells

    this.size = Math.floor(
      1 + Math.max(...cells.map((cell) => cell.column)) / 2,
    )
  }

  getCell(hex: Hex): Cell | undefined {
    if (!this.isInBounds(hex)) return undefined
    const found = this.cells[hex.row * this.size + Math.floor(hex.column / 2)]

    return found
  }

  isInBounds(hex: Hex): boolean {
    return (
      hex.column >= 0 &&
      hex.column < this.size * 2 &&
      hex.row >= 0 &&
      hex.row < this.size * 2
    )
  }

  getColumn(column: number): Cell[] {
    return this.cells.filter((cell) => cell.column === column)
  }

  getRow(row: number): Cell[] {
    return this.cells.filter((cell) => cell.row === row)
  }

  throwShade(solarLocation: SolarLocation) {
    this.cells.forEach((cell) => {
      if (cell.isInShade || cell.value === null || cell.value === 0) return
      let cellsToCheck: Cell[] = []

      switch (solarLocation) {
        case 'north': {
          const colum = this.getColumn(cell.column)
          cellsToCheck = colum.filter((c) => c.row > cell.row)
          break
        }
        case 'east': {
          const row = this.getRow(cell.row)
          cellsToCheck = row.filter((c) => c.column < cell.column).reverse()
          break
        }
        case 'south': {
          const colum = this.getColumn(cell.column)
          cellsToCheck = colum.filter((c) => c.row < cell.row).reverse()
          break
        }
        case 'west': {
          const row = this.getRow(cell.row)
          cellsToCheck = row.filter((c) => c.column > cell.column)
          break
        }
        default: {
          break
        }
      }

      for (const c of cellsToCheck) {
        if (c.value === null || c.value <= cell.value) {
          c.isInShade = true
        }
      }
    })
  }

  plantSeeds() {
    this.cells.forEach((cell) => {
      if (cell.value !== null) return
      if (cell.isInShade && !cell.isInLenslight) return

      const neighbors = this.getNeighbors(cell)
      const shouldPlant =
        neighbors.filter((n) => n?.value !== null && n.value >= 2).length >= 2
      if (shouldPlant) {
        cell.value = 0
        cell.isNewSeed = true
      }
    })
  }

  grow() {
    this.cells.forEach((cell) => {
      if (cell.value === null) return
      if (cell.isInShade && !cell.isInLenslight) return
      if (cell.isNewSeed) return
      cell.value++
    })
  }

  harvest() {
    let harvestCount = 0
    this.cells.forEach((cell) => {
      if (cell.value === 5) {
        cell.value = null
        harvestCount++
      }
    })
    return harvestCount
  }

  reset() {
    this.cells.forEach((cell) => {
      cell.isInShade = false
      cell.isNewSeed = false
      cell.isInLenslight = false
    })
  }

  getNeighbors(cell: Cell): Cell[] {
    const neighbors = []

    // top and bottom
    neighbors.push(this.getCell({ column: cell.column, row: cell.row - 2 }))
    neighbors.push(this.getCell({ column: cell.column, row: cell.row + 2 }))

    // left
    neighbors.push(this.getCell({ column: cell.column - 1, row: cell.row - 1 }))

    neighbors.push(this.getCell({ column: cell.column - 1, row: cell.row + 1 }))

    // right
    neighbors.push(this.getCell({ column: cell.column + 1, row: cell.row - 1 }))

    neighbors.push(this.getCell({ column: cell.column + 1, row: cell.row + 1 }))

    return neighbors.filter(Boolean) as Cell[]
  }

  addLenses(solarLocation: SolarLocation) {
    for (const cell of this.cells) {
      if (cell.value === null || cell.value === 0 || cell.isInShade) continue

      const diagonals = this.getDiagonals(cell, solarLocation)

      for (const diagonal of diagonals) {
        let minHeight = 0

        for (const target of diagonal) {
          if (
            minHeight === 0 &&
            (target.value === null || target.value === 0)
          ) {
            target.isInLenslight = true
          }

          if (target.value && target.value > minHeight) {
            target.isInLenslight = true
            minHeight = target.value
          }

          if (target.value && target.value >= cell.value) {
            break
          }
        }
      }
    }
  }

  getDiagonals(cell: Cell, solarLocation: SolarLocation): [Cell[], Cell[]] {
    const topToBottom = this.getDiagonal(cell, 'top-to-bottom')
    const bottomToTop = this.getDiagonal(cell, 'bottom-to-top')

    switch (solarLocation) {
      case 'north': {
        return [
          topToBottom?.filter((c) => c.row > cell.row),
          bottomToTop?.filter((c) => c.row > cell.row).toReversed(),
        ]
      }
      case 'east': {
        return [
          topToBottom?.filter((c) => c.column < cell.column).toReversed(),
          bottomToTop?.filter((c) => c.column < cell.column).toReversed(),
        ]
      }
      case 'south': {
        return [
          topToBottom?.filter((c) => c.row < cell.row).toReversed(),
          bottomToTop?.filter((c) => c.row < cell.row),
        ]
      }
      case 'west': {
        return [
          topToBottom?.filter((c) => c.column > cell.column),
          bottomToTop?.filter((c) => c.column > cell.column),
        ]
      }
      default: {
        return [[], []]
      }
    }
  }

  getDiagonal(cell: Cell, type: DiagonalType): Cell[] {
    const cells = []
    switch (type) {
      case 'top-to-bottom': {
        const startingY = cell.row - cell.column

        for (let i = 0; i < this.size * 2; i++) {
          const found = this.getCell({
            column: i,
            row: startingY + i,
          })
          if (found) {
            cells.push(found)
          }
        }
        return cells
      }

      case 'bottom-to-top': {
        const startingY = cell.column + cell.row
        for (let i = 0; i < this.size * 2; i++) {
          const found = this.getCell({
            column: i,
            row: startingY - i,
          })
          if (found) {
            cells.push(found)
          }
        }
        return cells
      }
      default: {
        return []
      }
    }
  }
}

type DiagonalType = 'top-to-bottom' | 'bottom-to-top'

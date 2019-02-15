export const matmul = (a, b) => {
  if (!a || !b) {
    console.log('cannot mulitiply undefined')
    return
  }
  if (a.length === 0 || b.length === 0) {
    console.log(
      `Cannot multiply empty arrays. length a: ${a.length} length b: ${
        b.length
      }`
    )
    return
  }
  if (a[0].length !== b.length) {
    console.log(
      `The number of columns of a (${
        a[0].length
      }) must match the number of rows of b (${b.length}).`
    )
    return
  }
  return a.map(rowA => {
    return b[0].map((item, bIndex) => {
      return rowA.reduce((acc, val, aIndex) => {
        return acc + val * b[aIndex][bIndex]
      }, 0)
    })
  })
}

export const scale = (matrix, amount) => {
  return matrix.map(row => row.map(item => item * amount))
}

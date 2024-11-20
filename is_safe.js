function isSafeRightNow(row, col, borderIndex, matrix) {
    return row > borderIndex && col > borderIndex && row < matrix.length - borderIndex - 1 && col < matrix[0].length - borderIndex - 1
}

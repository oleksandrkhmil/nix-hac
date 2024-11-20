function findNearestZero(matrix, start) {
    const queue = [start];
    const visited = new Set([start.toString()]);
  
    while (queue.length > 0) {
      const [row, col] = queue.shift();
  
      if (matrix[row][col] === 0 && row > 0 && col > 0 &&
          row < matrix.length - 1 && col < matrix[0].length - 1) {
        return [row, col];
      }
  
      // Check all neighbors (up, down, left, right)
      if (row > 0 && matrix[row - 1][col] === 0 && !visited.has(`${row - 1},${col}`)) {
        queue.push([row - 1, col]);
        visited.add(`${row - 1},${col}`);
      }
      if (row < matrix.length - 1 && matrix[row + 1][col] === 0 && !visited.has(`${row + 1},${col}`)) {
        queue.push([row + 1, col]);
        visited.add(`${row + 1},${col}`);
      }
      if (col > 0 && matrix[row][col - 1] === 0 && !visited.has(`${row},${col - 1}`)) {
        queue.push([row, col - 1]);
        visited.add(`${row},${col - 1}`);
      }
      if (col < matrix[0].length - 1 && matrix[row][col + 1] === 0 && !visited.has(`${row},${col + 1}`)) {
        queue.push([row, col + 1]);
        visited.add(`${row},${col + 1}`);
      }
    }
  
    return null;
  }
  
  const matrix = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0]
  ];
  const start = [2, 0];
  
  console.log(findNearestZero(matrix, start)); // Output: [3, 2]

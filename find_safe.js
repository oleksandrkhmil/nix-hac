const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0]
  ];
  
  const playerPosition = [2, 0];
  
  function isSafeField(row, col) {
    // Check if the field is safe (i.e., has a value of 0)
    return grid[row][col] === 0;
  }
  
  function isOnBorder(row, col) {
    // Check if the field is on the border
    return row === 0 || col === 0 || row === grid.length - 1 || col === grid[0].length - 1;
  }
  
  function findNearestSafeField() {
    const queue = [playerPosition];
    const visited = new Set();
    visited.add(playerPosition.join());
  
    while (queue.length > 0) {
      const currPos = queue.shift();
  
      if (!isOnBorder(...currPos) && isSafeField(...currPos)) {
        // Found a safe field that is not on the border
        return currPos;
      }
  
      // Add neighboring fields to the queue
      const row = currPos[0];
      const col = currPos[1];
  
      if (row > 0 && !visited.has([row - 1, col].join())) {
        queue.push([row - 1, col]);
        visited.add([row - 1, col].join());
      }
      if (col > 0 && !visited.has([row, col - 1].join())) {
        queue.push([row, col - 1]);
        visited.add([row, col - 1].join());
      }
      if (row < grid.length - 1 && !visited.has([row + 1, col].join())) {
        queue.push([row + 1, col]);
        visited.add([row + 1, col].join());
      }
      if (col < grid[0].length - 1 && !visited.has([row, col + 1].join())) {
        queue.push([row, col + 1]);
        visited.add([row, col + 1].join());
      }
    }
  
    // Could not find a safe field that is not on the border
    return null;
  }
  
  const nearestSafeField = findNearestSafeField();
  
  if (nearestSafeField) {
    console.log(`Nearest safe field: [${nearestSafeField}]`);
  } else {
    console.log('Could not find a safe field that is not on the border');
}

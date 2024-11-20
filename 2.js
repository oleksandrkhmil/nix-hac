
function transformMatrix(matrix) {
    const transformedMatrix = [];

    for (let i = 0; i < matrix.length; i++) {
      const newRow = [];

      for (let j = 0; j < matrix[i].length; j++) {
        const currentValue = matrix[i][j];
        
        if (currentValue === "A") {
          newRow.push(1);
        } else {
          newRow.push(0);
        }
      }
  
      transformedMatrix.push(newRow);
    }
  
    return transformedMatrix;
}


const arr = [
    ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
    ["A", "_", "_", "_", "_", "_", "PS", "_", "_", "_", "_", "_", "A"],
    ["A", "_", "A", "_", "_", "_", "_", "_", "_", "_", "A", "_", "A"],
    ["A", "_", "_", "C", "_", "A", "_", "A", "_", "C", "_", "_", "A"],
    ["A", "_", "_", "A", "_", "_", "_", "_", "_", "A", "_", "_", "A"],
    ["A", "_", "_", "_", "_", "A", "_", "A", "_", "_", "_", "_", "A"],
    ["A", "EE", "_", "_", "_", "_", "C", "_", "_", "_", "_", "EW", "A"],
    ["A", "_", "_", "_", "_", "A", "_", "A", "_", "_", "_", "_", "A"],
    ["A", "_", "_", "A", "_", "_", "_", "_", "_", "A", "_", "_", "A"],
    ["A", "_", "_", "C", "_", "A", "_", "A", "_", "C", "_", "_", "A"],
    ["A", "_", "A", "_", "_", "_", "_", "_", "_", "_", "A", "_", "A"],
    ["A", "_", "_", "_", "_", "_", "EN", "_", "_", "_", "_", "_", "A"],
    ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"]
];

console.log(transformMatrix(arr))

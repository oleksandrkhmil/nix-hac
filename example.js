
function pathToActionsV1(path) {
    let currentPosition = path[0];
    let currentDirection = "North";
    const actions = [];
  
    for (let i = 1; i < path.length; i++) {
      const nextPosition = path[i];
      const distance = Math.abs(nextPosition[0] - currentPosition[0]) + Math.abs(nextPosition[1] - currentPosition[1]);
      let direction;
  
      if (nextPosition[0] < currentPosition[0]) {
        direction = "West";
      } else if (nextPosition[0] > currentPosition[0]) {
        direction = "East";
      } else if (nextPosition[1] < currentPosition[1]) {
        direction = "South";
      } else {
        direction = "North";
      }
  
      if (direction === currentDirection) {
        actions.push("Move forward " + distance + " units");
      } else {
        const clockwiseDirections = ["North", "East", "South", "West"];
        const currentDirectionIndex = clockwiseDirections.indexOf(currentDirection);
        const nextDirectionIndex = clockwiseDirections.indexOf(direction);
        const diff = nextDirectionIndex - currentDirectionIndex;
  
        if (diff === 1 || diff === -3) {
          actions.push("Rotate right");
        } else {
          actions.push("Rotate left");
        }
  
        actions.push("Move forward " + distance + " units");
        currentDirection = direction;
      }
  
      currentPosition = nextPosition;
    }
  
    return actions;
}

function pathToActionsV2(currentDirection, path) {
    let currentPosition = path[0];
  
    // for (let i = 1; i < path.length; i++) {
    const nextPosition = path[1];
    console.log('currentDirection', currentDirection)
    console.log('currentPosition', currentPosition)
    console.log('nextPosition', nextPosition)

    let direction;

    if (nextPosition[0] < currentPosition[0]) {
        console.log('goal direction', 'N')
        direction = "N";
    } else if (nextPosition[0] > currentPosition[0]) {
        console.log('goal direction', 'S')
        direction = "S";
    } else if (nextPosition[1] < currentPosition[1]) {
        console.log('goal direction', 'W')
        direction = "W";
    } else {
        console.log('goal direction', 'E')
        direction = "E";
    }
  
    if (direction === currentDirection) {
        return "M"
    } else {
        const clockwiseDirections = ["N", "E", "S", "W"];
        const currentDirectionIndex = clockwiseDirections.indexOf(currentDirection);
        const nextDirectionIndex = clockwiseDirections.indexOf(direction);
        const diff = nextDirectionIndex - currentDirectionIndex;

        console.log('currentDirectionIndex', currentDirectionIndex)
        console.log('nextDirectionIndex', nextDirectionIndex)
  
        if (diff === 1 || diff === -3) {
            return "R"
        } else {
            return "L"
        }
    }
}

// const path = [
//     // [ 2, 10 ],
// // [ 3, 10 ],
// // [ 4, 10 ],
// // [ 5, 10 ],
// // [ 5, 9 ],
// // [ 5, 8 ],
// // [ 5, 7 ],
// [ 6, 7 ],
// [ 6, 6 ],
// ];

const path = [ [ 11, 6 ], [ 10, 6 ], [ 9, 6 ], [ 8, 6 ], [ 7, 6 ], [ 6, 6 ] ];

// console.log(pathToActionsV1(path))
console.log(pathToActionsV2("N", path))


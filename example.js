
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

const path = [ [ 2, 10 ],
[ 3, 10 ],
[ 4, 10 ],
[ 5, 10 ],
[ 5, 9 ],
[ 5, 8 ],
[ 5, 7 ],
[ 6, 7 ],
[ 6, 6 ] ];

console.log(pathToActionsV1(path))

const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    // console.log(req.body)
    res.send('Hello world!')
});

let index = 0

let borderIndex = 1

app.post('/move', (req, res) => {
    const { field, narrowingIn, gameId } = req.body;

    index++;
    // console.log('index', index);

    // console.log('-')
    printTableWithSpaces(copyDeepArray(field))
    // console.log('-')

    // console.log('narrowingIn', narrowingIn)

    if (narrowingIn >= 99) {
        borderIndex = 1
    }

    const narrowingMod = narrowingIn % 20
    if (narrowingMod === 0) {
        borderIndex++
        // console.log('borderIndex increase', borderIndex)
    }

    const move = calculateMove(field, narrowingIn, borderIndex); // TODO ADD BORDER INDEX
    // console.log("move", move)
    res.json(move);
});

app.get('/healthz', (req, res) => {
    // console.log(req.body)
    res.send({status: 'OK'})
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

/**
 * Find entity by key
 * P - player
 * E - enemy
 * C - coin
 * A - asteroid
 * _ - empty cell
 * 
 * Returns row, col & value:
 * N - north
 * S - south
 * W - west
 * E - east
 */
function findEntities(field, entity) {
    const positions = [];
    for (let row = 0; row < field.length; row++) {
        for (let col = 0; col < field[row].length; col++) {
            if (field[row][col][0] == entity) { // FIX
                positions.push({ row, col, value: field[row][col] });
            }
        }
    }

    return positions;
}

// Accepts:
// R - Rotate right. Spaceship turns to the right side, staying in the same cell.
// L - Rotate left. Spaceship turns to the left side, staying in the same cell.
// M - Move. Step one cell forward in the direction the ship is facing.
// F - Fire. Blast 4 cells in front of your ship.
function response(value) {
    return { move: value }
}

function calculateMove(field, narrowingIn, borderIndex) {
    const player = findEntities(field, "P")[0];
    const coins = findEntities(field, "C");
    const enemies = findEntities(field, "E");

    // console.log("player", player)

    // Если игрока нет, ничего не делаем
    if (!player) {
        return { move: "M" };
    }

    const { row: playerRow, col: playerCol, value: playerValue } = player;
    const playerDir = playerValue[1]; // Направление игрока

       // 1. Проверка на возможность стрельбы
       for (let enemy of enemies) {
        const { row: enemyRow, col: enemyCol } = enemy;

        if (
            (playerDir === "N" && playerCol === enemyCol && playerRow > enemyRow && playerRow - enemyRow <= 4) ||
            (playerDir === "S" && playerCol === enemyCol && playerRow < enemyRow && enemyRow - playerRow <= 4) ||
            (playerDir === "W" && playerRow === enemyRow && playerCol > enemyCol && playerCol - enemyCol <= 4) ||
            (playerDir === "E" && playerRow === enemyRow && playerCol < enemyCol && enemyCol - playerCol <= 4)
        ) {
            return { move: "F" };
        }
    }

    // 2. Движение к ближайшей монете
    // let closestCoin = closestEntity(coins)
    let closestCoin = null
    // // console.log("closest_coin", closestCoin)


    // 2. Движение к ближайшему врагу
    // console.log('enemies', enemies);
    let closestEnemy = closestEntity(playerRow, playerCol, enemies)
    // console.log("closest_enemy", closestEnemy)

    if (!closestCoin && !closestEnemy) {
        return { move: ["R", "L", "M"][Math.floor(Math.random() * 3)] };
    }

    const matrix = transformMatrix(field, borderIndex)

    // console.log('-matrix')
    printTableWithSpaces(copyDeepArray(matrix))
    // console.log('-')

    // const { row: coinRow, col: coinCol } = closestCoin;
    const { row: coinRow, col: coinCol } = closestEnemy;

    const start = [playerRow, playerCol];
    const target = [coinRow, coinCol];

    let path = waveAlgorithm(matrix, start, target)

    // console.log(path)

    // SEEK SAFE PLACE
    if (path === null) {
        // const safePlace = findSafePlace(transformMatrix(field, 0), [playerRow, playerCol], borderIndex)
        const withoutBorders = transformMatrix(field, 0);
        const safePlace = findNearestZero(withoutBorders, [playerRow, playerCol], borderIndex)
        // console.log('safePlace', safePlace)


        // console.log('-safe-matrix')
        printTableWithSpaces(copyDeepArray(withoutBorders))
        // console.log('-')

        const safePlacePath = waveAlgorithm(withoutBorders, start, safePlace)
        // console.log('safePlacePath', safePlacePath)

        path = safePlacePath
    }

    if (path.length === 1) {
        // console.log('skip move!')
        return { skip: 'true' }
    }

    // NEW ALGORITHM
    const pathToActionsV3Res = pathToActionsV3(playerDir, path)
    // console.log("pathToActionsV3Res: ", pathToActionsV3Res)

    if (pathToActionsV3Res != '') {
        return { move: pathToActionsV3Res };
    }

    // OLD
    if (closestCoin) {
        const { row: coinRow, col: coinCol } = closestCoin;
        const dr = coinRow - playerRow;
        const dc = coinCol - playerCol;

        if (dr < 0 && playerDir === "N") {
            // console.log('move N');
            return { move: "M" };
        }

        if (dr > 0 && playerDir === "S") {
            // console.log('move S');
            return { move: "M" };
        }

        if (dc < 0 && playerDir === "W") {
            // console.log('move W');
            return { move: "M" };
        }

        if (dc > 0 && playerDir === "E") {
            // console.log('move E');
            return { move: "M" };
        }


        // Поворот к монете
        if (dr < 0) {
            // console.log('rotate to N');
            // return { move: playerDir === "E" ? "L" : "R" };
        }

        if (dr > 0) {
            // console.log('rotate to S');
            // return { move: playerDir === "W" ? "L" : "R" };
        }

        if (dc < 0) {
            // console.log('rotate to W');
            // return { move: playerDir === "S" ? "L" : "R" };
            return { move: playerDir === "S" ? "R" : "L" };
        }

        if (dc > 0) {
            // console.log('rotate to E');
            // return { move: playerDir === "N" ? "L" : "R" };
            return { move: playerDir === "N" ? "R" : "L" };
        }
    }

    // 3. Случайное движение в отсутствие других приоритетов
    return { move: ["R", "L", "M"][Math.floor(Math.random() * 3)] };
}

function closestEntity(playerRow, playerCol, coins) {
    // 2. Движение к ближайшей монете
    let closestCoin = null;
    let minDistance = Infinity;
    for (let coin of coins) {
        const { row: coinRow, col: coinCol } = coin;
        const distance = Math.abs(playerRow - coinRow) + Math.abs(playerCol - coinCol); // Манхэттенское расстояние
        if (distance < minDistance) {
            minDistance = distance;
            closestCoin = coin;
        }
    }
    return closestCoin
}

function transformMatrix(matrix, borderIndex) {
    const transformedMatrix = [];

    for (let i = 0; i < matrix.length; i++) {
      const newRow = [];

      for (let j = 0; j < matrix[i].length; j++) {
        const currentValue = matrix[i][j];

        if (currentValue[0] === 'P') {
            newRow.push(0);
            continue
        }

        if (currentValue[0] === 'E') {
            newRow.push(0);
            continue
        }

        if (i <= borderIndex) {
            newRow.push(1);
            continue
        }

        if (j <= borderIndex) {
            newRow.push(1);
            continue
        }

        if (i >= matrix.length - borderIndex - 1) {
            newRow.push(1);
            continue
        }

        if (j >= matrix[i].length - borderIndex - 1) {
            newRow.push(1);
            continue
        }

        if (currentValue === "A") {
            newRow.push(1);
            continue
        } else {
            newRow.push(0);
            continue
        }
      }
  
      transformedMatrix.push(newRow);
    }
  
    return transformedMatrix;
}

function waveAlgorithm(grid, start, target) {
    const rows = grid.length;
    const cols = grid[0].length;

    const directions = [
        [0, 1],  // праворуч
        [1, 0],  // вниз
        [0, -1], // ліворуч
        [-1, 0]  // вгору
    ];

    const queue = [start];
    const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    distances[start[0]][start[1]] = 0;

    while (queue.length > 0) {
        const [x, y] = queue.shift();

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === 0) {
                if (distances[nx][ny] > distances[x][y] + 1) {
                    distances[nx][ny] = distances[x][y] + 1;
                    queue.push([nx, ny]);
                }
            }
        }
    }

    // Відновлення шляху
    if (distances[target[0]][target[1]] === Infinity) {
        return null; // Немає шляху
    }

    const path = [];
    let [x, y] = target;

    while (distances[x][y] !== 0) {
        path.push([x, y]);
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 && nx < rows &&
                ny >= 0 && ny < cols &&
                distances[nx][ny] === distances[x][y] - 1
            ) {
                x = nx;
                y = ny;
                break;
            }
        }
    }

    path.push(start);
    return path.reverse();
}

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
    const actions = [];
  
    for (let i = 1; i < path.length; i++) {
      const nextPosition = path[i];
      let direction;
  
      if (nextPosition[0] < currentPosition[0]) {
        direction = "W";
      } else if (nextPosition[0] > currentPosition[0]) {
        direction = "E";
      } else if (nextPosition[1] < currentPosition[1]) {
        direction = "S";
      } else {
        direction = "N";
      }
  
      if (direction === currentDirection) {
        return "M"
        // actions.push("Move forward " + distance + " units");
      } else {
        const clockwiseDirections = ["N", "E", "S", "W"];
        const currentDirectionIndex = clockwiseDirections.indexOf(currentDirection);
        const nextDirectionIndex = clockwiseDirections.indexOf(direction);
        const diff = nextDirectionIndex - currentDirectionIndex;
  
        if (diff === 1 || diff === -3) {
            return "R"
        } else {
            return "L"
        }
      }
    }
  
    return actions;
}


function pathToActionsV3(currentDirection, path) {
    let currentPosition = path[0];
  
    // for (let i = 1; i < path.length; i++) {
    const nextPosition = path[1];
    // console.log('currentDirection', currentDirection)
    // console.log('currentPosition', currentPosition)
    // console.log('nextPosition', nextPosition)

    let direction;

    if (nextPosition[0] < currentPosition[0]) {
        // console.log('goal direction', 'N')
        direction = "N";
    } else if (nextPosition[0] > currentPosition[0]) {
        // console.log('goal direction', 'S')
        direction = "S";
    } else if (nextPosition[1] < currentPosition[1]) {
        // console.log('goal direction', 'W')
        direction = "W";
    } else {
        // console.log('goal direction', 'E')
        direction = "E";
    }
  
    if (direction === currentDirection) {
        return "M"
    } else {
        const clockwiseDirections = ["N", "E", "S", "W"];
        const currentDirectionIndex = clockwiseDirections.indexOf(currentDirection);
        const nextDirectionIndex = clockwiseDirections.indexOf(direction);
        const diff = nextDirectionIndex - currentDirectionIndex;

        // console.log('currentDirectionIndex', currentDirectionIndex)
        // console.log('nextDirectionIndex', nextDirectionIndex)
  
        if (diff === 1 || diff === -3) {
            return "R"
        } else {
            return "L"
        }
    }
}

function printTableWithSpaces(arr) {
    for (let i = 0; i < arr.length; i++) {
        appendSpaceIfOneChar(arr[i])
        // console.log(arr[i].join(" "));
    }
}

function appendSpaceIfOneChar(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length === 1) {
        arr[i] += " ";
      }
    }
  
    return arr;
}

function copyDeepArray(arr) {
    const copy = [];
  
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        copy.push(copyDeepArray(arr[i]));
      } else {
        copy.push(arr[i]);
      }
    }
  
    return copy;
  }

// ADD CHECK TO NOT GO TO AREAS

function findSafePlace(matrix, current, borderIndex) {
    const grid = copyDeepArray(matrix);
      
    const playerPosition = current;
      
    function isSafeField(row, col) {
        // Check if the field is safe (i.e., has a value of 0)
        return grid[row][col] === 0;
    }
      
    function isOnBorder(row, col) {
        // Check if the field is on the border
        return row <= borderIndex || col <= borderIndex || row >= grid.length - borderIndex - 1 || col >= grid[0].length - borderIndex - 1;
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

    return findNearestSafeField()
}


// SAFE PLACE ALGO v2
function findNearestZero(matrix, start, borderIndex) {
    const queue = [start];
    const visited = new Set([start.toString()]);
  
    while (queue.length > 0) {
      const [row, col] = queue.shift();
  
      if (matrix[row][col] === 0 && row > borderIndex && col > borderIndex &&
          row < matrix.length - borderIndex - 1 && col < matrix[0].length - borderIndex - 1) {
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

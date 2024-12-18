const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    console.log(req.body)
    res.send('Hello world!')
});

app.post('/move', (req, res) => {
    const { field, narrowingIn, gameId } = req.body;

    const move = calculateMove(field);
    console.log("move", move)
    res.json(move);
});

app.get('/healthz', (req, res) => {
    console.log(req.body)
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
            if (field[row][col].includes(entity)) {
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

function calculateMove(field) {
    const player = findEntities(field, "P")[0];
    const coins = findEntities(field, "C");
    const enemies = findEntities(field, "E");

    console.log("player", player)

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

    console.log("closest_coin", closestCoin)

    if (!closestCoin) {
        return { move: ["R", "L", "M"][Math.floor(Math.random() * 3)] };
    }

    const matrix = transformMatrix(field)

    const { row: coinRow, col: coinCol } = closestCoin;

    const start = [playerRow, playerCol];
    const target = [coinRow, coinCol];

    const path = waveAlgorithm(matrix, start, target)

    console.log(path)

    // NEW ALGORITHM
    const pathToActionsV3Res = pathToActionsV3(playerDir, path)
    console.log("pathToActionsV3Res: ", pathToActionsV3Res)

    if (pathToActionsV3Res != '') {
        return { move: pathToActionsV3Res };
    }

    // OLD
    if (closestCoin) {
        const { row: coinRow, col: coinCol } = closestCoin;
        const dr = coinRow - playerRow;
        const dc = coinCol - playerCol;

        if (dr < 0 && playerDir === "N") {
            console.log('move N');
            return { move: "M" };
        }

        if (dr > 0 && playerDir === "S") {
            console.log('move S');
            return { move: "M" };
        }

        if (dc < 0 && playerDir === "W") {
            console.log('move W');
            return { move: "M" };
        }

        if (dc > 0 && playerDir === "E") {
            console.log('move E');
            return { move: "M" };
        }


        // Поворот к монете
        if (dr < 0) {
            console.log('rotate to N');
            // return { move: playerDir === "E" ? "L" : "R" };
        }

        if (dr > 0) {
            console.log('rotate to S');
            // return { move: playerDir === "W" ? "L" : "R" };
        }

        if (dc < 0) {
            console.log('rotate to W');
            // return { move: playerDir === "S" ? "L" : "R" };
            return { move: playerDir === "S" ? "R" : "L" };
        }

        if (dc > 0) {
            console.log('rotate to E');
            // return { move: playerDir === "N" ? "L" : "R" };
            return { move: playerDir === "N" ? "R" : "L" };
        }
    }

    // 3. Случайное движение в отсутствие других приоритетов
    return { move: ["R", "L", "M"][Math.floor(Math.random() * 3)] };
}

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

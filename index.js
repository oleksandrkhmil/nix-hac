const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    console.log(req.body)
    res.send('Hello world!')
});

app.get('/move', (req, res) => {
    const { field, narrowingIn, gameId } = req.body;

    const move = calculateMove(field);
    console.log(move)
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

    if (closestCoin) {
        const { row: coinRow, col: coinCol } = closestCoin;
        const dr = coinRow - playerRow;
        const dc = coinCol - playerCol;

        if (dr < 0 && playerDir === "N") return { move: "M" };
        if (dr > 0 && playerDir === "S") return { move: "M" };
        if (dc < 0 && playerDir === "W") return { move: "M" };
        if (dc > 0 && playerDir === "E") return { move: "M" };

        // Поворот к монете
        if (dr < 0) return { move: playerDir === "E" ? "L" : "R" };
        if (dr > 0) return { move: playerDir === "W" ? "L" : "R" };
        if (dc < 0) return { move: playerDir === "S" ? "L" : "R" };
        if (dc > 0) return { move: playerDir === "N" ? "L" : "R" };
    }

    // 3. Случайное движение в отсутствие других приоритетов
    return { move: ["R", "L", "M"][Math.floor(Math.random() * 3)] };
}
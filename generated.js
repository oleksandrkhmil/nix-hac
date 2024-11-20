function findEntities(field, entity) {
    // Находит все позиции заданного типа сущностей
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

function calculateMove(gameState) {
    const field = gameState.field;
    const narrowingIn = gameState.narrowingIn;

    const directions = {
        N: { dr: -1, dc: 0 },
        S: { dr: 1, dc: 0 },
        W: { dr: 0, dc: -1 },
        E: { dr: 0, dc: 1 }
    };

    const player = findEntities(field, "P")[0]; // Мы предполагаем, что игрок всегда один
    const coins = findEntities(field, "C");
    const enemies = findEntities(field, "E");
    const asteroids = findEntities(field, "A");

    if (!player) {
        // Если игрока нет, ничего не делаем
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

// Обработка POST-запроса
function handleMoveRequest(req, res) {
    const gameState = req.body; // Ожидаем, что состояние игры придет в теле запроса
    const move = calculateMove(gameState);
    res.json(move);
}

// Пример использования в Express
const express = require("express");
const app = express();
app.use(express.json());

app.post("/move", handleMoveRequest);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`AI server is running on port ${PORT}`);
});

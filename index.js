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

    console.log(field)
    console.log(narrowingIn)
    console.log(gameId)

    console.log(req.body)

    res.send('Hello world!')
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

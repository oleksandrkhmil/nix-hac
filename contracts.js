// Accepts:
// R - Rotate right. Spaceship turns to the right side, staying in the same cell.
// L - Rotate left. Spaceship turns to the left side, staying in the same cell.
// M - Move. Step one cell forward in the direction the ship is facing.
// F - Fire. Blast 4 cells in front of your ship.
function response(value) {
    return { move: value }
}

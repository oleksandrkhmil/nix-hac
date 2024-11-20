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

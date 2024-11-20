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

// // Приклад використання
// const grid = [
//     [0, 0, 0, 0, 0],
//     [0, 1, 1, 1, 0],
//     [0, 0, 0, 1, 0],
//     [0, 1, 0, 0, 0],
//     [0, 0, 0, 1, 0]
// ];
// const start = [0, 0];
// const target = [4, 4];

// const shortestPath = waveAlgorithm(grid, start, target);
// console.log(shortestPath);

const array = [
    [0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,0,1,1,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,1,0,0,0,1,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,0],
]

const start = [0, 0];
const target = [12, 12];


console.log(waveAlgorithm(array, start, target))
console.log(array[0][0], array[12][12])
function findPlayerPosition(field) {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            const currentValue = field[i][j];
            
            if (currentValue[0] === "P") {
                return i, j, currentValue[1]
            }
        }
    }
  
    throw Error("Player not found")
}
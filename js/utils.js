// ========== UTILITY/INTERNAL FUNCTIONS ==========

// returns the row of tile objects specified by rowNum
const _getRow = (rowNum) => {   
    return gameBoardArray[rowNum - 1];
}

// returns the column of tile objects specified by colNum, as a horizontal (1D) array
const _getCol = (colNum) => {
    const thisCol = [];

    for (row of gameBoardArray) {
        thisCol.push(row[colNum - 1]);
    }

    return thisCol;
}

// returns the diagonal of tile objects going downwards from the top left,
// as a horizontal (1D) array
const _getDiagDown = () => {
    const thisDiag = [];

    for (let rowCol = 0; rowCol < gameBoardArray.length; rowCol++) {
        thisDiag.push(gameBoardArray[rowCol][rowCol]);
    }

    return thisDiag;
}

// returns the diagonal of tile objects going upwards from the bottom left,
// as a horizontal (1D) array
const _getDiagUp = () => {
    const thisDiag = [];

    for (let row = 0; row < gameBoardArray.length; row++) {
        const col = gameBoardArray[row].length - row - 1;
        thisDiag.push(gameBoardArray[row][col]);
    }

    return thisDiag;
}

// returns whether the current move is X or O, in the form of the TILE_ constant
const _thisMove = () => {
    return (turnCount % 2 === 1 ? TILE_X : TILE_O);
}

// returns true if the specified property of every element in toCheck is the
// same, and false if otherwise
const _isArrayAllEqual = (toCheck, property) => {
    // due to the transitive property, it's sufficient to compare each
    // element to the first element
    return toCheck.every( function(thisElement) {
        return (thisElement[property] && thisElement[property] === toCheck[0][property]);
    });

}
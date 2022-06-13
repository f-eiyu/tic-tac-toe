// ========== UTILITY/INTERNAL FUNCTIONS ==========

// return the coordinates of every tile in row rowNum
const _getRowCoords = (toGetFrom, rowNum) => {   
    const fetchedRow = [];
    for (let colNum = 0; colNum < toGetFrom[rowNum].length; colNum++) {
        fetchedRow.push([rowNum, colNum]);
    }

    return fetchedRow;
}

// returns the coordinates of every tile in column colNum
const _getColCoords = (toGetFrom, colNum) => {
    const fetchedCol = [];

    for (let rowNum = 0; rowNum < toGetFrom.length; rowNum++) {
        fetchedCol.push([rowNum, colNum]);
    }

    return fetchedCol;
}

// returns the coordinates of every tile in the downwards diagonal
const _getDiagDownCoords = (toGetFrom) => {
    const fetchedDiag = [];

    for (let rowCol = 0; rowCol < toGetFrom.length; rowCol++) {
        fetchedDiag.push([rowCol, rowCol]);
    }

    return fetchedDiag;
}

// returns the coordinates of every tile in the upwards diagonal
const _getDiagUpCoords = (toGetFrom) => {
    const fetchedDiag = [];

    for (let row = 0; row < toGetFrom.length; row++) {
        const col = toGetFrom[row].length - row - 1;
        fetchedDiag.push([row, col]);
    }

    return fetchedDiag;
}

// returns the TILE_ constant indicating whether the current move is X or O
const _currentMoveLetter = (thisTurnNum = turnCounter) => {
    return (thisTurnNum % 2 === 1 ? TILE_X : TILE_O);
}

// takes an array of TILE_ and returns true if they're all the same
const _checkVectorForVictory = (toCheck) => {
    // due to the transitive property, it's sufficient to compare each
    // element to the first element.
    // TILE_BLANK is falsey, so this function will immediately fail if any of
    // the tiles being checked is blank.
    return toCheck.every( function(thisElement) {
        return (thisElement && thisElement === toCheck[0]);
    });
}

const _getDOMTileAt = (coordArray) => {
    return gameBoardDOMTiles[coordArray[0]][coordArray[1]];
}

// logs debugStr to the console if the debug flag is set
const debugLog = (debugStr) => {
    if (debug) { console.log(debugStr); };
}
// let the computer play a tile!
const computerTurn = () => { // placeholder
    return;
}


// some temporary functions rewritten to enable me to test the minimax AI.
// when my minimax work is done, the rewritten versions will be refactored
// into the main game code, and the main game code will be cleaned up and
// improved alongside.
const _isArrayAllEqualDebug = (toCheck) => {
    // due to the transitive property, it's sufficient to compare each
    // element to the first element.
    // thisElement is falsey if the tile is blank, so this function will
    // always return false if a blank tile is involved.
    return toCheck.every( function(thisElement) {
        return (thisElement && thisElement === toCheck[0]);
    });
}

const _getRowDebug = (toGetFrom, rowNum) => {   
    return toGetFrom[rowNum];
}

const _getColDebug = (toGetFrom, colNum) => {
    const thisCol = [];

    for (row of toGetFrom) {
        thisCol.push(row[colNum]);
    }

    return thisCol;
}

const _getDiagDownDebug = (toGetFrom) => {
    const thisDiag = [];

    for (let rowCol = 0; rowCol < toGetFrom.length; rowCol++) {
        thisDiag.push(toGetFrom[rowCol][rowCol]);
    }

    return thisDiag;
}

const _getDiagUpDebug = (toGetFrom) => {
    const thisDiag = [];

    for (let row = 0; row < toGetFrom.length; row++) {
        const col = toGetFrom[row].length - row - 1;
        thisDiag.push(toGetFrom[row][col]);
    }

    return thisDiag;
}

const checkVictoryDebug = (boardState, playedCoordinates) => {
    // it's impossible to win before the fifth turn
    if (turnCount < 5) { return false; }

    // this slightly clunky process of building and returning victoryTiles is solely
    // to handle the aesthetics of the special case of multiple victory conditions
    // being met simultaneously. for instance, the following
    //
    //     X X X
    //     X O O
    //     X O O
    //
    // is unlikely, but should highlight both the winning row and winning column
    // if it is achieved.
    const victoryTiles = [];
    const playedRow = playedCoordinates[0];
    const playedCol = playedCoordinates[1];
    
    // always check row and column
    if (debug) { console.log("Checking row and column"); }

    if (_isArrayAllEqualDebug(_getRowDebug(boardState, playedRow))) {
        victoryTiles.push(..._getRowDebug(boardState, playedRow));
    }
    if (_isArrayAllEqualDebug(_getColDebug(boardState, playedCol))) {
        victoryTiles.push(..._getColDebug(boardState, playedCol));
     }

    // check diagonal if we have a corner tile. the row and column must both be 
    // some permutation of 1 and gameBoardArray.length for a corner tile.
    if ((playedRow === 0 || playedRow === boardState.length - 1)
     && (playedCol === 0 || playedRow === boardState[0].length - 1)) {
        if (debug) { console.log("Checking a diagonal"); }

        // check downwards diag for a tile at (1, 1) or at (length, length)
        if (playedRow === playedCol && _isArrayAllEqualDebug(_getDiagDownDebug(boardState))) {
            victoryTiles.push(..._getDiagDownDebug(boardState));
        }

        // check upwards diag otherwise (for a tile at (1, length) or (length, 1))
        else if (_isArrayAllEqualDebug(_getDiagUpDebug(boardState))) {
            victoryTiles.push(..._getDiagUpDebug(boardState));
        }
    }

    // check both diagonals if we have a center tile
    else if (playedRow === 1 && playedCol === 1) { // magic number :(
        if (debug) { console.log("Center tile played - checking both diagonals"); }

        if (_isArrayAllEqualDebug(_getDiagDownDebug(boardState))) {
             victoryTiles.push(..._getDiagDownDebug(boardState));
            }

        if (_isArrayAllEqualDebug(_getDiagUpDebug(boardState))) {
            victoryTiles.push(..._getDiagUpDebug(boardState));
        }
    }

    return (victoryTiles.length ? victoryTiles : false);
}


const minimaxContainer = () => {
    // creates an array representation of the current board
    const virtualGameBoard = [];
    for (row of gameBoardArray) {
        const thisVirtualRow = [];
        for (col of row) {
            thisVirtualRow.push(col.content);
        }
        virtualGameBoard.push(thisVirtualRow);
    }

    // the recursion will manipulate and test copies of the virtual game board, not the real one
    executeMinimax(virtualGameBoard);
}

const executeMinimax = (virtualGameBoard) => {
    const possibleMoves =  []; // array of potential moves in [row, col] elements
    for (let row = 0; row < virtualGameBoard.length; row++) {
        for (let col = 0; col < virtualGameBoard[row].length; col++) {
            if (virtualGameBoard[row][col] === TILE_BLANK) {
                possibleMoves.push([row, col]);
            }
        }
    }

    console.log(possibleMoves);
}
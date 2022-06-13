// let the computer play a tile!
const computerTurn = () => { // placeholder
    return;
}


// some temporary functions rewritten to enable me to test the minimax AI.
// when my minimax work is done, the rewritten versions will be refactored
// into the main game code, and the main game code will be cleaned up and
// improved alongside.
const _isVictoriousDebug = (toCheck) => {
    // due to the transitive property, it's sufficient to compare each
    // element to the first element.
    // thisElement is falsey if the tile is blank, so this function will
    // always return false if a blank tile is involved.
    return toCheck.every( function(thisElement) {
        return (thisElement && thisElement === toCheck[0]);
    });
}

const _getRowDebug = (toGetFrom, rowNum) => {   
    const fetchedRow = [];
    for (let colNum = 0; colNum < toGetFrom[rowNum].length; colNum++) {
        fetchedRow.push([rowNum, colNum]);
    }

    return fetchedRow;
}

const _getColDebug = (toGetFrom, colNum) => {
    const fetchedCol = [];

    for (let rowNum = 0; rowNum < toGetFrom.length; rowNum++) {
        fetchedCol.push([rowNum, colNum]);
    }

    return fetchedCol;
}

const _getDiagDownDebug = (toGetFrom) => {
    const fetchedDiag = [];

    for (let rowCol = 0; rowCol < toGetFrom.length; rowCol++) {
        fetchedDiag.push([rowCol, rowCol]);
    }

    return fetchedDiag;
}

const _getDiagUpDebug = (toGetFrom) => {
    const fetchedDiag = [];

    for (let row = 0; row < toGetFrom.length; row++) {
        const col = toGetFrom[row].length - row - 1;
        fetchedDiag.push([row, col]);
    }

    return fetchedDiag;
}

const _getContentsDebug = (boardState, arguments) => {
    const fetchedTiles = [];
    for (coord of arguments) {
        fetchedTiles.push(boardState[coord[0]][coord[1]]);
    }
    
    return fetchedTiles;
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

    let rowTiles = _getRowDebug(boardState, playedRow);
    let colTiles = _getColDebug(boardState, playedCol);
    let diagDownTiles = _getDiagDownDebug(boardState);
    let diagUpTiles = _getDiagUpDebug(boardState);
    
    // always check row and column
    if (debug) { console.log("Checking row"); }

    if (_isVictoriousDebug(_getContentsDebug(boardState, rowTiles))) {
        console.log("Row victory");
        victoryTiles.push(...rowTiles);
    }

    if (_isVictoriousDebug(_getContentsDebug(boardState, colTiles))) {
        console.log("Column victory");
        victoryTiles.push(...colTiles);
     }

    // if the row coordinate equals the column coordinate, we're always on the downwards diagonal
     if (playedRow === playedCol) {
        if (debug) { console.log("Checking downwards diagonal"); }

        if (_isVictoriousDebug(_getContentsDebug(boardState, diagDownTiles))) {
            if (debug) { console.log("Downwards diagonal victory"); }

            victoryTiles.push(...diagDownTiles);
        }
     }

     // if the row + column coordinates equal the board size, we're on the upwards diagonal
     if (playedRow + playedCol === boardState.length - 1) {
        if (debug) { console.log("Checking upwards diagonal"); }

        if (_isVictoriousDebug(_getContentsDebug(boardState, diagUpTiles))) {
            if (debug) { console.log("Upwards diagonal victory"); }

            victoryTiles.push(...diagUpTiles);
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
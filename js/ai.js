// let the computer play a tile!
const computerTurn = () => { // placeholder
    return;
}


const computerTile = TILE_X;

// some temporary functions rewritten to enable me to test the minimax AI.
// when my minimax work is done, the rewritten versions will be refactored
// into the main game code, and the main game code will be cleaned up and
// improved alongside.
const _checkVectorForVictory = (toCheck) => {
    // due to the transitive property, it's sufficient to compare each
    // element to the first element.
    // thisElement is falsey if the tile is blank, so this function will
    // always return false if a blank tile is involved.
    return toCheck.every( function(thisElement) {
        return (thisElement && thisElement === toCheck[0]);
    });
}

const _getRowCoords = (toGetFrom, rowNum) => {   
    const fetchedRow = [];
    for (let colNum = 0; colNum < toGetFrom[rowNum].length; colNum++) {
        fetchedRow.push([rowNum, colNum]);
    }

    return fetchedRow;
}

const _getColCoords = (toGetFrom, colNum) => {
    const fetchedCol = [];

    for (let rowNum = 0; rowNum < toGetFrom.length; rowNum++) {
        fetchedCol.push([rowNum, colNum]);
    }

    return fetchedCol;
}

const _getDiagDownCoords = (toGetFrom) => {
    const fetchedDiag = [];

    for (let rowCol = 0; rowCol < toGetFrom.length; rowCol++) {
        fetchedDiag.push([rowCol, rowCol]);
    }

    return fetchedDiag;
}

const _getDiagUpCoords = (toGetFrom) => {
    const fetchedDiag = [];

    for (let row = 0; row < toGetFrom.length; row++) {
        const col = toGetFrom[row].length - row - 1;
        fetchedDiag.push([row, col]);
    }

    return fetchedDiag;
}

function _getContentsDebug(boardState, toGet) {
    const fetchedTiles = [];
    for (coord of toGet) {
        fetchedTiles.push(boardState[coord[0]][coord[1]]);
    }
    
    return fetchedTiles;
}

const _thisMoveDebug = (thisTurnNum) => {
    return (thisTurnNum % 2 === 1 ? TILE_X : TILE_O);
}

const checkBoardForVictor = (boardState, turnNum) => {
    // it's impossible to win before the fifth turn
    if (turnNum < 5) { return false; }

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

    // check rows
    for (let row = 0; row < boardState.length; row++) {
        if (_checkVectorForVictory(boardState[row])) {
            victoryTiles.push(..._getRowCoords(boardState, row));
        }
    }

    // check columns
    for (let col = 0; col < boardState[0].length; col++) {
        const thisCol = [];
        for (let row = 0; row < boardState.length; row++) {
            thisCol.push(boardState[row][col]);
        }

        if (_checkVectorForVictory(thisCol)) {
            victoryTiles.push(..._getColCoords(boardState, col));
        }
    }

    // check descending diagonal
    const diagDown = [];
    for (let rowCol = 0; rowCol < boardState.length; rowCol++) {
        diagDown.push(boardState[rowCol][rowCol]);
    }

    if (_checkVectorForVictory(diagDown)) {
        victoryTiles.push(..._getDiagDownCoords(boardState));
    }

    // check ascending diagonal
    const diagUp = [];
    for (let rowCol = 0; rowCol < boardState.length; rowCol++) {
        diagUp.push(boardState[rowCol][boardState.length - rowCol - 1]);
    }

    if (_checkVectorForVictory(diagUp)) {
        victoryTiles.push(..._getDiagUpCoords(boardState));
    }


    // let rowTiles = _getRowCoords(boardState, playedRow);
    // let colTiles = _getColCoords(boardState, playedCol);
    // let diagDownTiles = _getDiagDownCoords(boardState);
    // let diagUpTiles = _getDiagUpCoords(boardState);
    
    // if (debug) { console.log("Checking rows"); }
    // if (_checkVectorForVictory(_getContentsDebug(boardState, _getRowCoords(boardState, row)))) {
    //     if (debug) { console.log("Row victory"); }
    //     victoryTiles.push(...rowTiles);
    // }

    // if (debug) { console.log("Checking columns"); }
    // if (_checkVectorForVictory(_getContentsDebug(boardState, colTiles))) {
    //     if (debug) { console.log("Column victory"); }
    //     victoryTiles.push(...colTiles);
    //  }

    // // if the row coordinate equals the column coordinate, we're always on the downwards diagonal
    //  if (playedRow === playedCol) {
    //     if (debug) { console.log("Checking downwards diagonal"); }

    //     if (_checkVectorForVictory(_getContentsDebug(boardState, diagDownTiles))) {
    //         if (debug) { console.log("Downwards diagonal victory"); }

    //         victoryTiles.push(...diagDownTiles);
    //     }
    //  }

    //  // if the row + column coordinates equal the board size, we're on the upwards diagonal
    //  if (playedRow + playedCol === boardState.length - 1) {
    //     if (debug) { console.log("Checking upwards diagonal"); }

    //     if (_checkVectorForVictory(_getContentsDebug(boardState, diagUpTiles))) {
    //         if (debug) { console.log("Upwards diagonal victory"); }

    //         victoryTiles.push(...diagUpTiles);
    //     }
    //  }

    if (!victoryTiles.length) { return false; }
    else { return boardState[victoryTiles[0][0]][victoryTiles[0][1]]; }
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
      console.log(executeMinimax(virtualGameBoard, turnCounter));
}

const executeMinimax = (virtualGameBoard, turnNum) => {
    // first, check the current state of the board, and if it's already a game
    // end, return the result of that game
    let gameIsWon = checkBoardForVictor(virtualGameBoard);
    if (gameIsWon) { return (gameIsWon === computerTile ? 1 : -1); }
    // check for a tie afterwards, and return zero if so
    if (turnNum > 9) { return 0; }

    // if the game is still going, elucidate all remaining moves this turn
    const possibleMoves =  []; // array of [row, col]
    const possibleScores = []; // array of scores, respective to possibleMoves
    for (let row = 0; row < virtualGameBoard.length; row++) {
        for (let col = 0; col < virtualGameBoard[row].length; col++) {
            if (virtualGameBoard[row][col] === TILE_BLANK) {
                possibleMoves.push([row, col]);
                possibleScores.push(null);
            }
        }
    }

    // make each possible move and find a score for it by recursing minimax
    for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
        const thisGameBoard = structuredClone(virtualGameBoard);
        const thisMove = possibleMoves[moveIndex]; // [row, col]

        thisGameBoard[thisMove[0]][thisMove[1]] = _thisMoveDebug(turnNum);
        possibleScores[moveIndex] = executeMinimax(thisGameBoard, turnNum + 1);
    }

    console.log(possibleMoves, possibleScores, turnNum);
    // when we're at the minimum recursion depth, we need to return which move
    // to make to the parent function; however, any further in the tree and
    // we don't care about which move is which specifically -- only how good/bad
    // the options are.
    if (turnNum === turnCounter) {
        let bestIndex = 0;
        for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
            if (possibleScores[moveIndex] > possibleScores[bestIndex]) {
                bestIndex = moveIndex;
            }
        }

        return possibleMoves[bestIndex];
    } else {
        return (computerTile === _thisMoveDebug(turnNum) ? Math.max(...possibleScores) : Math.min(...possibleScores));
    }
}
// takes an array of TILE_ and checks if they're all the same
const _checkVectorForVictory = (toCheck) => {
    // due to the transitive property, it's sufficient to compare each
    // element to the first element.
    // TILE_BLANK is falsey, so this function will immediately fail if any of
    // the tiles being checked is blank.
    return toCheck.every( function(thisElement) {
        return (thisElement && thisElement === toCheck[0]);
    });
}

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
const _thisMoveDebug = (thisTurnNum) => {
    return (thisTurnNum % 2 === 1 ? TILE_X : TILE_O);
}

// looks at the current state of the game board and checks if either player has
// achieved victory. returns false if the board does not contain a victory, and
// returns an array containing the victorious tiles otherwise.
const checkBoardForVictor = (boardState, turnNum) => {
    // it's impossible to win before the fifth turn
    if (turnNum < 5) { return false; }

    debugLog("Checking for victory");

    // this slightly clunky process of building/returning victoryTiles is solely
    // to handle the aesthetics of multiple victory conditions being met
    // simultaneously. for instance, the following
    //
    //     X X X
    //     X O O
    //     X O O
    //
    // is unlikely, but the game should highlight both the winning row 
    // winning column if it is achieved, so it needs to "remember" both sets
    // of winning tiles.
    const victoryTiles = [];

    debugLog("Checking rows");
    for (let row = 0; row < boardState.length; row++) {
        if (_checkVectorForVictory(boardState[row])) {
            victoryTiles.push(..._getRowCoords(boardState, row));
            debugLog("Row victory found");
        }
    }

    debugLog("Checking columns");
    for (let col = 0; col < boardState[0].length; col++) {
        const thisCol = [];
        for (let row = 0; row < boardState.length; row++) {
            thisCol.push(boardState[row][col]);
        }

        if (_checkVectorForVictory(thisCol)) {
            victoryTiles.push(..._getColCoords(boardState, col));
            debugLog("Column victory found");
        }
    }

    debugLog("Checking descending diagonal");
    const diagDown = [];
    for (let rowCol = 0; rowCol < boardState.length; rowCol++) {
        diagDown.push(boardState[rowCol][rowCol]);
    }

    if (_checkVectorForVictory(diagDown)) {
        victoryTiles.push(..._getDiagDownCoords(boardState));
        debugLog("Descending diagonal victory found");
    }

    debugLog("Checking ascending diagonal");
    const diagUp = [];
    for (let rowCol = 0; rowCol < boardState.length; rowCol++) {
        diagUp.push(boardState[rowCol][boardState.length - rowCol - 1]);
    }

    if (_checkVectorForVictory(diagUp)) {
        victoryTiles.push(..._getDiagUpCoords(boardState));
        debugLog("Ascending diagonal victory found");
    }

    if (!victoryTiles.length) { return false; }
    else { return boardState[victoryTiles[0][0]][victoryTiles[0][1]]; }
}

// given a boardState, recursively finds all possible future moves and assigns
// the move a numerical value based on whether it leads to victory
const executeMinimax = (boardState, turnNum) => {
    debugLog(`  Minimax recursion: turn number ${turnNum}`);

    // first, check the current state of the board, and if it's already a game
    // end, return the result of that game.
    let gameIsWon = checkBoardForVictor(boardState);
    if (gameIsWon) { return (gameIsWon === computerTile ? 1 : -1); }
    // check for a tie afterwards, and return zero if so
    if (turnNum > 9) { return 0; }

    // if the game is still going, elucidate all remaining moves this turn
    const possibleMoves =  []; // array of [row, col]
    const possibleScores = []; // array of scores, respective to possibleMoves
    for (let row = 0; row < boardState.length; row++) {
        for (let col = 0; col < boardState[row].length; col++) {
            if (boardState[row][col] === TILE_BLANK) {
                possibleMoves.push([row, col]);
                possibleScores.push(null);
            }
        }
    }

    // make each possible move and find a score for it by recursing minimax
    for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
        const thisGameBoard = structuredClone(boardState);
        const thisMove = possibleMoves[moveIndex]; // [row, col]

        thisGameBoard[thisMove[0]][thisMove[1]] = _thisMoveDebug(turnNum);
        possibleScores[moveIndex] = executeMinimax(thisGameBoard, turnNum + 1);

        // the minimax algorithm can be condensed for tic-tac-toe: due to the
        // simplicity of the game, the search can simply end if a +1 is found
        // for the maximizer or a -1 is found for the minimizer, because we will
        // never need to take any other option (ie. any remaining, unchecked,
        // options wil be, at best, equally optimal to the one we already have).
        if (possibleScores[moveIndex] === (computerTile === _thisMoveDebug(turnNum) ? 1 : -1)) {
            // if the recursion depth is 1, decideComputerAction() needs a move;
            // otherwise, the algorithm only needs a score to be returned
            if (turnNum === turnCounter) {
                debugLog(`Minimax selected the move ${possibleMoves[moveIndex]}`);
                return possibleMoves[moveIndex];
            }
            return possibleScores[moveIndex];
        }
    }

    // we make it here if no move leads to a guaranteed victory (for maximizer)
    // or loss (for minimizer), so in this case we simply want to return the
    // most optimal option that remains.
    if (turnNum === turnCounter) { // again, decideComputerAction() needs a move
        let bestIndex = 0;
        for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
            if (possibleScores[moveIndex] > possibleScores[bestIndex]) {
                bestIndex = moveIndex;
            }
        }

        debugLog(`Minimax selected the move ${possibleMoves[bestIndex]}`);
        return possibleMoves[bestIndex];
    } else { // maximize on the AI's turns and minimize on the player's turns
        return (computerTile === _thisMoveDebug(turnNum) ?
            Math.max(...possibleScores) :
            Math.min(...possibleScores));
    }
}

// returns a random empty tile from the array of currently empty tiles
const executeRandomAI = (virtualGameBoard) => {
    // elucidate all remaining moves
    const possibleMoves = [];
    for (let row = 0; row < virtualGameBoard.length; row++) {
        for (let col = 0; col < virtualGameBoard[row].length; col++) {
            if (virtualGameBoard[row][col] === TILE_BLANK) {
                possibleMoves.push([row, col]);
            }
        }
    }

    // select a move at random
    const thisMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    debugLog(`Computer randomly selected the move ${thisMove}`);
    return thisMove; 
}

// returns the result of minimax for a smart AI, or a random tile for a dumb one
const decideComputerAction = () => {
    debugLog("The computer is thinking");
    // makes a copy of the current game board for the AI's scratch work
    const virtualGameBoard = [];
    for (row of gameBoardArray) {
        const thisVirtualRow = [];
        for (col of row) {
            thisVirtualRow.push(col.content);
        }
        virtualGameBoard.push(thisVirtualRow);
    }

    if (computerHardMode) {
        return executeMinimax(virtualGameBoard, turnCounter);
    } else {
        return executeRandomAI(virtualGameBoard);
    }
}

// lets the computer make a move!
const computerTurn = () => {
    if (!playAgainstComputer) { return false; }

    const thisAction = decideComputerAction();

    turnCounter++;
}
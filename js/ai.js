// ========== FUNCTIONS RELATED TO AI BEHAVIOR ==========

// given a boardState, recursively finds all possible future moves and assigns
// the move a score based on whether it leads to victory. ultimately returns
// the optimal move to make for the given boardState.
// maximizer gets +1 for a win, -1 for a loss, 0 for a tie.
const executeMinimax = (virtualGameBoard, turnNum) => {
    // first, check the current state of the board, and if it's already a game
    // end, return the result of that game
    const gameIsWon = checkBoardForVictor(virtualGameBoard, turnNum);
    if (gameIsWon) { 
        const winningTile = virtualGameBoard[gameIsWon[0][0]][gameIsWon[0][1]];
        return (winningTile === computerTile ? 1 : -1);
    }
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

        thisGameBoard[thisMove[0]][thisMove[1]] = _currentMoveLetter(turnNum);
        possibleScores[moveIndex] = executeMinimax(thisGameBoard, turnNum + 1);

        // the minimax algorithm can be significantly condensed for tic-tac-toe:
        // due to the game's straightforward victory conditions, the search can
        // just end if a +1 is found for the maximizer or a -1 is found for the
        // minimizer. we will never need to take any other option -- that is to
        // say, any remaining, unchecked, options would be, at best, just as
        // good as the one we have now.
        if (possibleScores[moveIndex] === (computerTile === _currentMoveLetter(turnNum) ? 1 : -1)) {
            // if the recursion depth is 1, decideComputerAction() needs a move;
            // otherwise, the algorithm only needs a score to be returned
            if (turnNum === turnCounter) {
                debugLog(`Minimax selected the move ${possibleMoves[moveIndex]}`);
                return possibleMoves[moveIndex];
            }
            return possibleScores[moveIndex];
        }
    }

    // when we're at the minimum recursion depth, we need to return which move
    // to make to the parent function; however, any further in the tree and
    // we don't care about *which* move is which, specifically -- only about
    // how good/bad the outcomes are. thus, we don't bother returning the
    // tile coords at all in that case, since only the score matters.
    if (turnNum === turnCounter) {
        let bestIndex = 0;
        for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
            if (possibleScores[moveIndex] > possibleScores[bestIndex]) {
                bestIndex = moveIndex;
            }
        }

        return possibleMoves[bestIndex];
    } else { // maximize on the AI's turns and minimize on the player's turns
        return (computerTile === _currentMoveLetter(turnNum) ?
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
    for (row of gameBoardDOMTiles) {
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

    playTile(gameBoardDOMTiles[thisAction[0]][thisAction[1]]);
}
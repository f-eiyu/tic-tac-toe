// ========== GAMEPLAY BACKEND FUNCTIONS ==========

// looks at the current state of the game board and checks if either player has
// achieved victory. returns false if the board does not contain a victory, and
// returns an array containing the victorious tiles otherwise.
const checkBoardForVictor = (boardState, turnNum = turnCounter) => {
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
    else {
        debugLog("Winning tiles:");
        debugLog(victoryTiles);
        return victoryTiles; }
}
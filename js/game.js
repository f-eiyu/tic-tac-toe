console.log("Linked!");

/// ========== GAMEPLAY/UI FUNCTIONS ==========

// change tile aesthetics when hovered...
const hoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.classList.add("hovered");
    thisTile.innerText = (_thisMove() === TILE_X ? "X" : "O");
}

// ... and change back when not hovered
const unhoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.classList.remove("hovered");
    thisTile.innerText = "";
}

// check for victory: search only the row, column, and maybe diagonal associated
// with the last move that was made.
const checkVictory = (thisTile) => {
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
    
    // always check row and column
    if (debug) { console.log("Checking row and column"); }

    if (_isArrayAllEqual(_getRow(thisTile.row), "content")) {
        victoryTiles.push(..._getRow(thisTile.row));
    }
    if (_isArrayAllEqual(_getCol(thisTile.col), "content")) {
        victoryTiles.push(..._getCol(thisTile.col))
     }

    // check diagonal if we have a corner tile. the row and column must both be 
    // some permutation of 1 and gameBoardArray.length for a corner tile.
    if ((thisTile.row === 1 || thisTile.row === gameBoardArray.length)
     && (thisTile.col === 1 || thisTile.col === gameBoardArray.length)) {
        if (debug) { console.log("Checking a diagonal"); }

        // check downwards diag for a tile at (1, 1) or at (length, length)
        if (thisTile.row === thisTile.col && _isArrayAllEqual(_getDiagDown(), "content")) {
            victoryTiles.push(..._getDiagDown());
        }

        // check upwards diag otherwise (for a tile at (1, length) or (length, 1))
        else if (_isArrayAllEqual(_getDiagUp(), "content")) {
            victoryTiles.push(..._getDiagUp());
        }
    }

    // check both diagonals if we have a center tile
    else if (thisTile.row === 2 && thisTile.col === 2) { // magic number :(
        if (debug) { console.log("Center tile played - checking both diagonals"); }

        if (_isArrayAllEqual(_getDiagDown(), "content")) {
             victoryTiles.push(..._getDiagDown());
            }

        if (_isArrayAllEqual(_getDiagUp(), "content")) {
            victoryTiles.push(..._getDiagUp());
        }
    }

    return (victoryTiles.length ? victoryTiles : false);
}

// end the game and displays a victory message
const executeVictory = (winningTiles) => {
    if (!winningTiles) { return false; }
    
    if (debug) { console.log("Victory reached:\n", winningTiles); }

    // bookkeeping
    gameIsLive = false;
    gamesCompleted++;

    // aesthetics
    document.querySelector("#text-victory").style.display = "inline";
    document.querySelector("#text-next-tile").style.display = "none";
    for (tile of winningTiles) { tile.classList.add("victory"); }
    document.querySelector("#info-game-count").innerText = `${gamesCompleted} game${gamesCompleted === 1 ? "" : "s"}`;
    document.querySelector("#text-winning-player").innerHTML = winningTiles[0].innerHTML;

    return true;
}

// end the game and displays a tie message
const executeTie = () => { // still mostly placeholder
    if (turnCount < 9) { return false; }

    if (debug) { console.log("Tie game reached"); }

    // bookkeeping
    gameIsLive = false;
    gamesCompleted++;

    // aesthetics
    document.querySelector("#text-tie").style.display = "inline";
    document.querySelector("#text-next-tile").style.display = "none";

    return true;
}

// play a tile when it's clicked. returns false if the tile click was invalidated by
// occupation, existing victory, etc., and true if the tile actually changed.
const clickTile = (event) => {
    const thisTile = event.target;
    if (debug) { console.log(`Clicked tile at (${thisTile.row},${thisTile.col})`); }

    if (!gameIsLive) { return false; }
    if (thisTile.content) { return false; }

    if (debug) { console.log("Click succeeded"); }    

    thisTile.content = _thisMove();

    // update the tile graphically
    thisTile.classList.add("played");
    thisTile.classList.remove("hovered");
    thisTile.innerText = `${ _thisMove() === TILE_X ? "X" : "O" }`;

    if (executeVictory(checkVictory(thisTile))) { return true; }
    if (executeTie()) { return true; }
        
    turnCount++;

    // update infobox
    document.querySelector("#info-next-tile").innerText = _thisMove() === TILE_X ? "X" : "O";
    document.querySelector("#info-current-turn").innerText = turnCount;
    
    return true;
}

// removes everything from the game board and completely resets the game state and infobox
const resetGameState = (gameBoardContainer) => {
    if (debug) { console.log("Resetting game"); }

    while (gameBoardContainer.firstChild) {
        gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    }
    while (gameBoardArray.length) { gameBoardArray.pop(); }
    turnCount = 1;
    document.querySelector("#text-victory").style.display = "none";
    document.querySelector("#text-tie").style.display = "none";
    document.querySelector("#text-next-tile").style.display = "inline";
    document.querySelector("#info-next-tile").innerText = "X";
    document.querySelector("#info-current-turn").innerText = "1";
}

// creates and initializes a new tile at (row, col) for a fresh tic-tac-toe game
const createTile = (row, col) => {
    const newTile = document.createElement("div");
    newTile.classList.add("game-tile");

    newTile.addEventListener("click", clickTile);
    newTile.addEventListener("mouseover", hoverTile);
    newTile.addEventListener("mouseout", unhoverTile);

    newTile.content = TILE_BLANK;
    newTile.row = row;
    newTile.col = col;

    if (debug) { console.log(`Created new tile at (${row}, ${col})`); }
    return newTile;
}

// start a fresh, brand new game of tic tac toe
const initializeGameBoard = () => {
    const gameBoardContainer = document.querySelector("#game-board");

    resetGameState(gameBoardContainer);

    // start a new game!
    for (let row = 1; row <= 3; row++) {
        const thisRow = [];
        for (let col = 1; col <= 3; col++) {
            const newTile = createTile(row, col);

            // add the tile to the grid and keep track of it internally
            gameBoardContainer.appendChild(newTile);
            thisRow.push(newTile);
        }

        gameBoardArray.push(thisRow);
    }

    gameIsLive = true;
    if (debug) { console.log("Successfully started a new game!"); }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeGameBoard();
    document.querySelector("#reset-button").addEventListener("click", initializeGameBoard);
});
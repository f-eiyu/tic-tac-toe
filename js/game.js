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

// play a tile when it's clicked
const clickTile = (event) => {
    const thisTile = event.target;

    // mark the move in the tile
    thisTile.content = _thisMove();

    // update the tile graphically
    thisTile.classList.add("played");
    thisTile.innerText = `${_thisMove() === TILE_X ? "X" : "O"}`;

    turnCount++;
}

// check for victory: search only the row, column, and maybe diagonal associated
// with the last move that was made.
const checkVictory = (event) => {
    // it's impossible to win before turn 5
    if (turnCount < 5) { return; }

    thisTile = event.target;
    
    // always check row and column
    if (debug) { console.log("Checking row and column"); }
    if (_isArrayAllEqual(_getRow(thisTile.row), "content")) { return true; }
    else if (_isArrayAllEqual(_getCol(thisTile.col), "content")) { return true; }

    // check diagonal if we have a corner tile. the row and column must both be 
    // some permutation of 1 and gameBoardArray.length for a corner tile.
    else if ((thisTile.row === 1 || thisTile.row === gameBoardArray.length)
            && (thisTile.col === 1 || thisTile.col === gameBoardArray.length)) {
        if (debug) { console.log("Checking diagonal"); }
        // check downwards diag for a tile at (1, 1) or at (length, length)
        if (thisTile.row === thisTile.col && _isArrayAllEqual(_getDiagDown(), "content")) { return true; }

        // check upwards diag otherwise (for a tile at (1, length) or (length, 1))
        else if (_isArrayAllEqual(_getDiagUp(), "content")) { return true; }
    }

    // check both diagonals if we have a center tile
    else if (thisTile.row === 2 && thisTile.col === 2) { // magic number :(
        if (debug) { console.log("Center tile - checking both diagonals"); }
        if (_isArrayAllEqual(_getDiagDown(), "content")) { return true; }
        else if (_isArrayAllEqual(_getDiagUp(), "content")) { return true; }
    }

    // if we've made it here, all our victory checks have failed
    return false;
}

// end the game and displays a victory message
const executeVictory = (winner) => { // still mostly placeholders
    if (debug) { console.log("Victory reached"); }
    gameIsLive = false;
}

// end the game and displays a tie message
const executeTie = () => { // still mostly placeholders
    if (debug) { console.log("Tie game reached"); }
    gameIsLive = false;
}

// start a fresh, brand new game of tic tac toe
const initializeGameBoard = () => {
    const gameBoardContainer = document.querySelector("#game-board");

    // purge a potential previous game
    while (gameBoardContainer.firstChild) {
        gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    }
    while (gameBoardArray.length) { gameBoardArray.pop(); }
    turnCount = 0;


    //determine opponent and difficulty using document.querySelector("#opponent").selectedIndex 


    // generate the game board
    for (let row = 1; row <= 3; row++) {
        const thisRowArray = [];
    for (let col = 1; col <= 3; col++) {
        const thisTile = document.createElement("div");
        thisTile.classList.add("game-tile");

        thisTile.addEventListener("click", function (e) {
            if (debug) { console.log("Clicked the tile at", thisTile.row, thisTile.col); }
            
            if (!gameIsLive) { return; } // stop if the game isn't live
            if (e.target.content) { return; } // stop if the tile is already occupied

            if (debug) { console.log("Click successfully registered"); }
            
            clickTile(e);
            if (checkVictory(e)) { executeVictory(); }
            else if (turnCount >= 9) { executeTie(); }
            else if (playAgainstComputer) { computerTurn(); }
        });
        thisTile.addEventListener("mouseover", hoverTile);
        thisTile.addEventListener("mouseout", unhoverTile);

        thisTile.content = TILE_BLANK;
        thisTile.row = row;
        thisTile.col = col;

        // add the tile to the grid and keep track of it internally
            gameBoardContainer.appendChild(thisTile);
            thisRowArray.push(thisTile);
        }

        gameBoardArray.push(thisRowArray);
    }

    gameIsLive = true;
    if (debug) { console.log("Tile framework loaded!"); }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeGameBoard();
    document.querySelector("#reset-button").addEventListener("click", initializeGameBoard);
});
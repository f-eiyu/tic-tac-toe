console.log("Linked!");

// ========== GLOBALS ==========

// constants for tile contents
const TILE_BLANK = 0; // falsey, to make conditionals easier later on
const TILE_X = 1; // X and Y both truthy
const TILE_O = 2;

// aesthetic constants
const TILE_BG_COLOR_DEFAULT = "#CCC";
const TILE_BG_COLOR_HOVERED = "#AAA";
const TILE_BG_COLOR_PLAYED = "#FFF";
const TEXT_HOVER_COLOR = "#888";
const TEXT_PLAYED_COLOR = "#000";
const TEXT_VICTORY_COLOR = "green";
const TEXT_DEFEAT_COLOR = "red";

// global variables
let turnCount = 0;
let gameIsLive = false;

const gameBoardArray = []; // 2D array that stores each tile object



// ========== UTILITY/INTERNAL FUNCTIONS ==========

// returns the DOM for the tile at the specified position
// ex. _retrieveTile(1, 3) -> returns the top right tile
const _getTile = (rowNum, colNum) => {
    return gameBoardArray[rowNum - 1][colNum - 1];
}

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

// returns whether the current move should be X or O, in the form of the TILE_ constant
const _thisMove = () => {
    return (turnCount % 2 === 0 ? TILE_X : TILE_O);
}

// transposes a square two-dimensional array
const _transposeArray = (toTranspose) => {
    const transposed = [];

    for (let col = 0; col < toTranspose.length; col++) {
        const thisColumn = [];
        for (let row = 0; row < toTranspose[col].length; row++) {
            thisColumn.push(toTranspose[row][col]);
        }
        transposed.push(thisColumn);
    }

    return transposed;
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


/// ========== GAMEPLAY/UI FUNCTIONS ==========

// change tile aesthetics when hovered...
const hoverTile = (event) => { // placeholder for now
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.style.backgroundColor = TILE_BG_COLOR_HOVERED;
    thisTile.style.color = TEXT_HOVER_COLOR;
    thisTile.innerText = (_thisMove() === TILE_X ? "X" : "O");
}

// ... and change back when not hovered
const unhoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.style.backgroundColor = TILE_BG_COLOR_DEFAULT;
    thisTile.innerText = "";
}

// check victory conditions and potentially end game
// naive approach: hard-code and check every potentially winning pattern
const checkVictory = () => {
    // impossible to win before turn 5 no matter how well/badly someone plays
    if (turnCount < 5) { return false; }

    // check every row
    for (row of gameBoardArray) {
        if (_isArrayAllEqual(row, "content")) { return true; }
    }

    // transpose array for easier column access
    const gameBoardArrayTranspose = _transposeArray(gameBoardArray);
    // check every column (ie. every row in the transposed array)
    for (row of gameBoardArrayTranspose) {
        if (_isArrayAllEqual(row, "content")) { return true; }
    }

    // check descending diagonal
    const diagDown = [];
    for (let rowCol = 0; rowCol < gameBoardArray.length; rowCol++) {
        diagDown.push(gameBoardArray[rowCol][rowCol]);
    }
    if (_isArrayAllEqual(diagDown, "content")) { return true; }

    // check ascending diagonal
    const diagUp = [];
    for (let row = 0; row < gameBoardArray.length; row++) {
        let col = gameBoardArray[row].length - row - 1;
        diagUp.push(gameBoardArray[row][col]);
    }
    if (_isArrayAllEqual(diagUp, "content")) { return true; }

    // if we've made it here, all of our victory checks have failed
    return false;
}

// alternate, more efficient method to check victory: check only the row, column, and
// maybe diagonal associated with the last move made.
const checkVictoryAlt = (event) => {
    // it's impossible to win before turn 5
    if (turnCount < 5) { return; }

    thisTile = event.target;

    console.log("thisTile", thisTile.row, thisTile.col, ((thisTile.row === 1 || thisTile.row === gameBoardArray.length)
    && (thisTile.col === 1 || thisTile.col === gameBoardArray.length))); // debug
    console.log(_getDiagDown());
    
    // always check row and column
    if (_isArrayAllEqual(_getRow(thisTile.row), "content")) { return true; }
    else if (_isArrayAllEqual(_getCol(thisTile.col), "content")) { return true; }

    // only check diagonal if we have a corner tile. the row and column must both be 
    // some permutation of 1 and gameBoardArray.length for a corner tile.
    else if ((thisTile.row === 1 || thisTile.row === gameBoardArray.length)
            && (thisTile.col === 1 || thisTile.col === gameBoardArray.length)) {
                // check downwards diag for a tile at (1, 1) or at (length, length)
                if (thisTile.row === thisTile.col && _isArrayAllEqual(_getDiagDown(), "content")) { return true; }

                // check upwards diag otherwise (for a tile at (1, length) or (length, 1))
                else if (_isArrayAllEqual(_getDiagUp(), "content")) { return true; }
    }

    // if we've made it here, all our victory checks have failed
    return false;
}

// ends the game and displays a victory message
const executeVictory = (winner) => { // still mostly placeholders
    console.log("victory");
    gameIsLive = false;
}

// ends the game and displays a tie message
const executeTie = () => { // still mostly placeholders
    console.log("tie game");
    gameIsLive = false;
}

// play a tile when it's clicked
const clickTile = (event) => {
    if (!gameIsLive) { return; }

    const thisTile = event.target;
    if (thisTile.content) { return; } // don't do anything if the tile is already played

    // remember the move
    thisTile.content = _thisMove();

    // update the tile graphically
    thisTile.style.backgroundColor = TILE_BG_COLOR_PLAYED;
    thisTile.style.color = TEXT_PLAYED_COLOR;
    thisTile.innerText = `${_thisMove() === TILE_X ? "X" : "O"}`;

    turnCount++;
}

// start a fresh, brand new game of tic tac toe
const initializeGameBoard = () => {
    const gameBoardContainer = document.querySelector("#game-board");

    // empty gameBoardContainer and gameBoardArray to purge a potential previous game
    while (gameBoardContainer.firstChild) {
        gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    }
    while (gameBoardArray.length) { gameBoardArray.pop(); }

    // generate nine game tiles
    for (let row = 1; row <= 3; row++) { // three rows
        const thisRowArray = [];
        for (let col = 1; col <= 3; col++) { // three columns
            const thisTile = document.createElement("div");
            thisTile.classList.add("game-tile");

            // listen to each tile
            thisTile.addEventListener("click", function (e) {
                if (gameIsLive) {
                    clickTile(e);
                    if (checkVictoryAlt(e)) { executeVictory(); }
                    else if (turnCount >= 9) { executeTie(); }
                }
            });
            thisTile.addEventListener("mouseover", hoverTile);
            thisTile.addEventListener("mouseout", unhoverTile);

            // initialize each tile's properties
            thisTile.content = TILE_BLANK;
            thisTile.row = row;
            thisTile.col = col;

            // make the tile pretty
            thisTile.style.backgroundColor = TILE_BG_COLOR_DEFAULT;

            // add the tile to the grid and keep track of it internally
            gameBoardContainer.appendChild(thisTile);
            thisRowArray.push(thisTile);
        }

        // build gameBoardArray in rows
        gameBoardArray.push(thisRowArray);
    }

    gameIsLive = true;
    console.log("Tile framework loaded!"); // debug
}



// debug
initializeGameBoard();
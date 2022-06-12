console.log("Linked!");

// ========== GLOBALS ==========

// constants for tile contents
const TILE_BLANK = 0; // falsey, to make conditionals easier later on
const TILE_X = 1; // X and Y both truthy
const TILE_O = 2;

// constants for opponent
const OPP_TWOPLAYER = 0;
const OPP_COMP_EASY = 1;
const OPP_COMP_HARD = 2;

// global variables and flags
let turnCount = 0;
let gameIsLive = false;
let numberOfGames = 0;
let playAgainstComputer = false;
let computerHardMode = false;
const BOARD_SIZE = 3;

let debug = true;
let aiDebug = true;

const gameBoardArray = []; // 2D array that stores each tile object



// ========== UTILITY/INTERNAL FUNCTIONS ==========

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

// returns whether the current move is X or O, in the form of the TILE_ constant
const _thisMove = () => {
    return (turnCount % 2 === 0 ? TILE_X : TILE_O);
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

// let the computer play a tile!
const computerTurn = () => { // placeholder
    return;
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
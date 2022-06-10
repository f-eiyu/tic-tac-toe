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



// ========== UTILITY FUNCTIONS ==========

// returns the DOM for the tile at the specified position
// ex. retrieveTile(1, 3) -> returns the top right tile
const retrieveTile = (rowNum, colNum) => {
    return gameBoardArray[rowNum - 1][colNum - 1];
}

// returns whether the current move should be X or O, in the form of the TILE_ constant
const thisMove = () => {
    return (turnCount % 2 === 0 ? TILE_X : TILE_O);
}

// transposes a square two-dimensional array
const transposeArray = (toTranspose) => {
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
const isArrayAllEqual = (toCheck, property) => {
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
    thisTile.innerText = (thisMove() === TILE_X ? "X" : "O");
}

// ... and change it back when not hovered
const unhoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.style.backgroundColor = TILE_BG_COLOR_DEFAULT;
    thisTile.innerText = "";
}

// check victory conditions and potentially end game
const checkVictory = () => {
    // impossible to win before turn 5 no matter how well/badly someone plays
    if (turnCount < 5) { return; }

    // naive approach: hard-code and check every potentially winning pattern

    // check every row
    for (row of gameBoardArray) {
        if (isArrayAllEqual(row, "content")) { return true; }
    }

    // transpose array for easier column access
    const gameBoardArrayTranspose = transposeArray(gameBoardArray);
    // check every column (ie. every row in the transposed array)
    for (row of gameBoardArrayTranspose) {
        if (isArrayAllEqual(row, "content")) { return true; }
    }

    // check descending diagonal
    const diagDown = [];
    for (let rowCol = 0; rowCol < gameBoardArray.length; rowCol++) {
        diagDown.push(gameBoardArray[rowCol][rowCol]);
    }
    if (isArrayAllEqual(diagDown, "content")) { return true; }

    // check ascending diagonal
    const diagUp = [];
    for (let row = 0; row < gameBoardArray.length; row++) {
        let col = gameBoardArray[row].length - row - 1;
        diagUp.push(gameBoardArray[row][col]);
    }
    if (isArrayAllEqual(diagUp, "content")) { return true; }
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
    thisTile.content = thisMove();

    // update the tile graphically
    thisTile.style.backgroundColor = TILE_BG_COLOR_PLAYED;
    thisTile.style.color = TEXT_PLAYED_COLOR;
    thisTile.innerText = `${thisMove() === TILE_X ? "X" : "O"}`;

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
                    if (checkVictory()) { executeVictory(); }
                    else if (turnCount >= 9) { executeTie(); }
                }
            });
            thisTile.addEventListener("mouseover", hoverTile);
            thisTile.addEventListener("mouseout", unhoverTile);

            // initialize each tile's properties
            thisTile.content = TILE_BLANK;

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
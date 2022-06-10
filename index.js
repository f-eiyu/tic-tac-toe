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

// global variables
let turnCount = 0;
let gameIsLive = false;

const gameBoardArray = []; // 2D array that stores each tile object



// ========== UTILITY FUNCTIONS ==========

// returns the DOM for the tile at the specified position
// ex. retrieveTile(1, 3) -> returns the top right tile
const retrieveTile = (rowNum, colNum) => {
    return gameBoardArray[rowNum, colNum];
}

// returns whether the current move should be X or O, in the form of the TILE_ constant
const thisMove = () => {
    return (turnCount % 2 === 0 ? TILE_X : TILE_O);
}



/// ========== GAMEPLAY/UI FUNCTIONS ==========

// change tile aesthetics when hovered...
const hoverTile = (event) => { // placeholder for now
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.style.backgroundColor = TILE_BG_COLOR_HOVERED;
    thisTile.style.color = "#666";
    thisTile.innerText = (thisMove() === TILE_X ? "X" : "O");
}

// and change it back when not hovered
const unhoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.style.backgroundColor = TILE_BG_COLOR_DEFAULT;
    thisTile.innerText = "";
}

// check victory conditions and potentially end game
const checkVictory = () => { // placeholder for now
    return;
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
    thisTile.style.color = "#000";
    thisTile.innerText = `${thisMove() === TILE_X ? "X" : "O"}`;

    turnCount++;

    // check for victory after each move
    checkVictory();
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
            thisTile.addEventListener("click", clickTile);
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
console.log(retrieveTile(3, 1));
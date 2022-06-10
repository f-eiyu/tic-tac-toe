console.log("Linked!");

// ========== GLOBALS ==========

// constants for tile contents
const TILE_BLANK = 0; // falsey, to make conditionals easier later on
const TILE_X = 1; // X and Y both truthy
const TILE_O = 2;

// global variables
let turnCount = 0;



// ========== UTILITY FUNCTIONS ==========

// returns the DOM for the tile at the specified position
// ex. retrieveTile(1, 3) -> returns the top right tile
const retrieveTile = (rowNum, colNum) => {
    // filter by row...
    const fetchedRow = document.querySelectorAll(`.row-${rowNum}`);
    // .. then by column
    return fetchedRow[colNum - 1];
}

// returns whether the current move should be X or O, in the form of the TILE_ constant
const thisMove = () => {
    return (turnCount % 2 === 0 ? TILE_X : TILE_O);
}



/// ========== GAMEPLAY/UI FUNCTIONS ==========

// change tile bg color when hovered
const hoverTile = (event) => { // placeholder for now
    return;
}

// check victory conditions and potentially end game
const checkVictory = () => { // placeholder for now
    return;
}

// play a tile when it's clicked
const clickTile = (event) => {
    const thisTile = event.target;
    if (thisTile.content) { return; } // don't do anything if the tile is already played

    thisTile.innerText += `\n${thisMove() === TILE_X ? "X" : "O"}`;
    thisTile.content = thisMove();

    turnCount++;

    // check for victory after each move
    checkVictory();
}

// 
const initializeGameBoard = () => {
    const gameBoardContainer = document.querySelector("#game-board");

    // generate nine game tiles
    for (let row = 1; row <= 3; row++) { // three rows
        for (let col = 1; col <= 3; col++) { // three columns
            const thisTile = document.createElement("div");
            thisTile.classList.add("game-tile");

            // track each of their positions
            thisTile.classList.add(`row-${row}`);
            thisTile.classList.add(`col-${col}`);

            // listen to each tile
            thisTile.addEventListener("click", clickTile);
            thisTile.addEventListener("mouseover", hoverTile);

            // initialize each tile's properties
            thisTile.content = TILE_BLANK;

            // add the tile to the grid
            gameBoardContainer.appendChild(thisTile);

            thisTile.innerText = `(${row}, ${col})`; // debug
        }
        
    }

    console.log("Tile framework loaded!"); // debug
}









// debug
initializeGameBoard();
console.log(retrieveTile(3, 1));
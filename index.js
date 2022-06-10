console.log("Linked!");

const TILE_BLANK = 0; // falsey, to make conditionals easier later on
const TILE_X = 1;
const TILE_Y = 2;

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

            // initialize tile properties
            thisTile.content = TILE_BLANK;

            // add the tile to the grid
            gameBoardContainer.appendChild(thisTile);

            thisTile.innerText = `(${row}, ${col})`; // debug
        }
        
    }

    console.log("Tile framework loaded!"); // debug
}

function clickTile(event) { // placeholder for now
    return;
}

// returns the DOM for the tile at the specified position
// ex. retrieveTile(1, 3) -> returns the top right tile
const retrieveTile = (rowNum, colNum) => {
    // fetch by row...
    console.log(`.row-${rowNum}`);
    const fetchedRow = document.querySelectorAll(`.row-${rowNum}`);
    console.log(fetchedRow);
    // .. then by column
    return fetchedRow[colNum - 1];
}







// debug
initializeGameBoard();
console.log(retrieveTile(3, 1));
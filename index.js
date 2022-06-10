console.log("Linked!");

const generateGameBoard = () => {
    const gameBoardContainer = document.querySelector("#game-board");
    // generate nine game tiles and track each of their positions
    for (let row = 1; row <= 3; row++) { // three rows
        for (let col = 1; col <= 3; col++) { // three columns
            const thisTile = document.createElement("div");
            thisTile.classList.add("game-tile");
            thisTile.classList.add(`row-${row}`);
            thisTile.classList.add(`col-${col}`);
            gameBoardContainer.appendChild(thisTile);

            thisTile.innerText = `(${row}, ${col})`; // debug
        }
        
    }

    console.log("Tile framework loaded!"); // debug
}

// returns the DOM for the tile at the specified position
// ex. retrieveTile(1, 3) -> returns the top right tile
const retrieveTile = (rowNum, colNum) => {
    // fetch by row...
    console.log(`.row-${rowNum}`);
    const fetchedRow = document.querySelectorAll(`.row-${rowNum}`);
    console.log(fetchedRow);
    // .. then by column
    console.log(fetchedRow[colNum - 1]);
}

// debug
generateGameBoard();
retrieveTile(3, 1);
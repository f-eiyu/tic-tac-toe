/// ========== GAMEPLAY FUNCTIONALITY ==========

// change tile aesthetics when hovered...
const hoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.classList.add("hovered");
    thisTile.innerText = (_currentMoveLetter() === TILE_X ? "X" : "O");
}

// ... and change back when not hovered
const unhoverTile = (event) => {
    const thisTile = event.target;

    if (!gameIsLive || thisTile.content) { return; }

    thisTile.classList.remove("hovered");
    thisTile.innerText = "";
}

// end the game and displays a victory message
const executeVictory = (winningTiles) => {
    if (!winningTiles) { return false; }
    
    debugLog("Victory reached", winningTiles);

    // bookkeeping
    gameIsLive = false;
    gamesCompleted++;

    // aesthetics
    for (tileCoords of winningTiles) {
        gameBoardDOMTiles[tileCoords[0]][tileCoords[1]].classList.add("victory");
    }

    const firstWinningTile = _getDOMTileAt(winningTiles[0]);

    document.querySelector("#text-victory").style.display = "inline";
    document.querySelector("#text-next-tile").style.display = "none";
    document.querySelector("#info-game-count").innerText = `${gamesCompleted} game${gamesCompleted === 1 ? "" : "s"}`;
    document.querySelector("#text-winning-player").innerText = firstWinningTile.innerText;

    return true;
}

// end the game and displays a tie message
const executeTie = () => { // still mostly placeholder
    if (turnCounter < 9) { return false; }

    debugLog("Tie game reached");

    // bookkeeping
    gameIsLive = false;
    gamesCompleted++;

    // aesthetics
    document.querySelector("#text-tie").style.display = "inline";
    document.querySelector("#text-next-tile").style.display = "none";
    document.querySelector("#info-game-count").innerText = `${gamesCompleted} game${gamesCompleted === 1 ? "" : "s"}`;
    for (row of gameBoardDOMTiles) {
        for (tile of row) {
            tile.classList.add("tie");
        }
    }

    return true;
}

// plays a tile and then checks for victory/tie. DOES NOT check whether the tile
// is actually valid to play; this should be done before calling playTile.
// returns true if the game should end and false if it should continue.
const playTile = (tileToPlay) => {
    // update the board state
    tileToPlay.content = _currentMoveLetter();
    gameBoardState[tileToPlay.row][tileToPlay.col] = _currentMoveLetter();

    // update the tile graphically
    tileToPlay.classList.add("played");
    tileToPlay.classList.remove("hovered");
    tileToPlay.innerText = `${ _currentMoveLetter() === TILE_X ? "X" : "O" }`;

    // check victory and defeat conditions
    if (executeVictory(checkBoardForVictor(gameBoardState))) { return true; }
    if (executeTie()) { return true; }
        
    turnCounter++;

    // update infobox
    document.querySelector("#info-next-tile").innerText = _currentMoveLetter() === TILE_X ? "X" : "O";
    document.querySelector("#info-current-turn").innerText = turnCounter;
    
    return false;
}

// checks whether a tile is valid when it's clicked, and then plays it if it's
// legal to play. after the player's turn, if there's a computer opponent,
// it will take its turn.
const playerClickTile = (event) => {
    const thisTile = event.target;
    debugLog(`Clicked tile at (${thisTile.row},${thisTile.col})`);

    if (!gameIsLive) { return; }
    if (thisTile.content) { return; }

    debugLog("Click succeeded");

    if (!playTile(thisTile)) { computerTurn(); }
}

// removes everything from the game board and completely resets the game state and infobox
const resetGameState = (gameBoardContainer) => {
    debugLog("Resetting game");

    while (gameBoardContainer.firstChild) {
        gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    }
    while (gameBoardDOMTiles.length) { gameBoardDOMTiles.pop(); }
    while (gameBoardState.length) { gameBoardState.pop(); }

    turnCounter = 1;

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

    newTile.addEventListener("click", playerClickTile);
    newTile.addEventListener("mouseover", hoverTile);
    newTile.addEventListener("mouseout", unhoverTile);

    newTile.content = TILE_BLANK;
    newTile.row = row;
    newTile.col = col;

    debugLog(`Created new tile at (${row}, ${col})`);
    return newTile;
}

// toggles flags for the type of game the player selected
const determineGameType = () => {
    switch (document.querySelector("#opponent").selectedIndex) {
        case OPP_COMP_EASY_X:
            playAgainstComputer = true;
            computerHardMode = false;
            computerTile = TILE_X;
            break;
        case OPP_COMP_EASY_O:
            playAgainstComputer = true;
            computerHardMode = false;
            computerTile = TILE_O;
            break;
        case OPP_COMP_HARD_X:
            playAgainstComputer = true;
            computerHardMode = true;
            computerTile = TILE_X;
            break;
        case OPP_COMP_HARD_O:
            playAgainstComputer = true;
            computerHardMode = true;
            computerTile = TILE_O;
            break;
        case OPP_TWOPLAYER:
        default:
            playAgainstComputer = false;
            computerHardMode = false;
            break;
    }
}

// start a fresh, brand new game of tic tac toe
const initializeGameBoard = () => {
    const gameBoardContainer = document.querySelector("#game-board");

    resetGameState(gameBoardContainer);
    determineGameType();

    for (let row = 0; row <= GAME_ROW_COUNT; row++) {
        const thisRow = [];
        const thisStateRow = [];
        for (let col = 0; col <= GAME_COL_COUNT; col++) {
            const newTile = createTile(row, col);

            // add new tile to the grid and keep track of it internally
            gameBoardContainer.appendChild(newTile);
            thisRow.push(newTile);
            thisStateRow.push(TILE_BLANK);
        }

        gameBoardDOMTiles.push(thisRow);
        gameBoardState.push(thisStateRow);
    }

    gameIsLive = true;
    debugLog("Successfully started a new game");

    // if computer is X, it goes before the player!
    if (computerTile === TILE_X) { computerTurn(); }
}

// start the game
document.addEventListener("DOMContentLoaded", function () {
    initializeGameBoard();
    document.querySelector("#reset-button").addEventListener("click", initializeGameBoard);
    debugLog("Game loaded!");
});
// ========== GLOBALS ==========

// constants for tile contents
const TILE_BLANK = 0; // falsey, to make conditionals easier later on
const TILE_X = 1; // X and Y both truthy
const TILE_O = 2;

// constants for the game itself
const GAME_ROW_COUNT = 2; // zero indexed
const GAME_COL_COUNT = 2; // zero indexed

// constants for opponent
const OPP_TWOPLAYER = 0;
const OPP_COMP_EASY_X = 1;
const OPP_COMP_EASY_O = 2;
const OPP_COMP_HARD_X = 3;
const OPP_COMP_HARD_O = 4;

// global variables and flags
let turnCounter = 1;
let gameIsLive = false;
let gamesCompleted = 0;
let playAgainstComputer = false;
let computerHardMode = false;
let computerTile = TILE_X;
const BOARD_SIZE = 3;

const debug = false;

const gameBoardState = []; /* 2D array that stores TILE_ constants and directly
                              encodes the state of the board */
const gameBoardDOMTiles = []; // 2D array that stores each tile object
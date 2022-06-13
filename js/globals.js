// ========== GLOBALS ==========

// constants for tile contents
const TILE_BLANK = 0; // falsey, to make conditionals easier later on
const TILE_X = 1; // X and Y both truthy
const TILE_O = 2;

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
const BOARD_SIZE = 3;

const debug = false;
const debugAI = true;

const gameBoardArray = []; // 2D array that stores each tile object
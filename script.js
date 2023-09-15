function revealCell() {
    const x = parseInt(document.getElementById('coordX').value);
    const y = parseInt(document.getElementById('coordY').value);

    if (!board[x][y].isOpen && !board[x][y].isFlagged) {
        board[x][y].isOpen = true;
        squaresLeft--;
        console.log("Squares left on the board: " + squaresLeft);
        console.log(board);

        if (board[x][y].hasBomb) {
            alert('Game Over! You clicked on a bomb.');
            location.reload();
        }
    }
    else{
        console.log("You selected an Opened or Flagged place");
    }
}

function changeDifficulty() {
    const selectedDifficulty = document.getElementById('difficulty').value;
    const bombProbInput = document.getElementById('bombProb').value;
    const maxProbInput = document.getElementById('maxProb').value;
    let rowCount, colCount;

    if (selectedDifficulty === 'easy') {
        rowCount = 9;
        colCount = 9;
    } else if (selectedDifficulty === 'medium') {
        rowCount = 16;
        colCount = 16;
    } else if (selectedDifficulty === 'expert') {
        rowCount = 24;
        colCount = 24;
    }

    bombProbability = parseInt(bombProbInput);
    maxProbability = parseInt(maxProbInput);

    board = [];
    openedSquares = [];
    flaggedSquares = [];
    bombCount = 0;
    squaresLeft = 0;

    minesweeperGameBootstrapper(colCount, rowCount);

}

/*
*
* "board" is a matrix that holds data about the
* game board, in a form of BoardSquare objects
*
* openedSquares holds the position of the opened squares
*
* flaggedSquares holds the position of the flagged squares
*
 */
let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;


function minesweeperGameBootstrapper(rowCount, colCount) {
    let easy = {
        'rowCount': 9,
        'colCount': 9,
    };

    if (rowCount == null && colCount == null) {
        // TODO: Set a default difficulty (e.g., easy)
        generateBoard(easy);
    } else {
        generateBoard({ 'rowCount': rowCount, 'colCount': colCount });
    }
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;
    console.log("Squares left on the board: " + squaresLeft);

    /*
    *
    * "generate" an empty matrix
    *
     */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
    }

    /*
    *
    * TODO: Fill the matrix with "BoardSquare" objects, that are in a pre-initialized state
    *
    */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            // Initialize each square as not having a bomb and 0 bombs around
            board[i][j] = new BoardSquare(false, 0);
        }
    }

    /*
    *
    * "place" bombs according to the probabilities declared at the top of the file
    * those could be read from a config file or env variable, but for the
    * simplicity of the solution, I will not do that
    *
    */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            // TODO: Place the bomb, you can use the following formula: Math.random() * maxProbability < bombProbability
            if (Math.random() * maxProbability < bombProbability) {
                board[i][j].hasBomb = true;
                bombCount++;
            }
        }
    }

    /*
    *
    * TODO: Set the state of the board, with all the squares closed
    * and no flagged squares
    *
     */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            board[i][j].isOpen = false;
            board[i][j].isFlagged = false;
        }
    }

    /*
    *
    * TODO: Count the bombs around each square
    *
    */
    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = countBombsAroundSquare(i, j, boardMetadata);
            }
        }
    }

    /*
    *
    * Print the board to the console to see the result
    *
    */
    console.log(board);
}

function countBombsAroundSquare(x, y, boardMetadata) {
    const directions = [
        { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
        { dx: -1, dy: 0 }, { dx: 0, dy: 0 }, { dx: 1, dy: 0 },
        { dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }
    ];

    let bombCount = 0;

    for (const dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;

        if (newX >= 0 && newX < boardMetadata.colCount && newY >= 0 && newY < boardMetadata.rowCount) {
            if (board[newX][newY].hasBomb) {
                bombCount++;
            }
        }
    }
    return bombCount;
}

/*
*
* Simple object to keep the data for each square
* of the board
*
*/
class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
        this.isOpen = false;
        this.isFlagged = false;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/*
* Call the function that "handles the game"
* called at the end of the file because if called at the start,
* all the global variables will appear as undefined / out of scope
*
 */
// minesweeperGameBootstrapper(6, 6);

// TODO: Create the other required functions such as 'discovering' a tile, and so on (also make sure to handle the win/loss cases)

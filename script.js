// gameBoard module
const gameBoard = (() => {

    // symbol: 'e' means the cell is empty
    let board = [
        ['e', 'e', 'e'],
        ['e', 'e', 'e'],
        ['e', 'e', 'e']
    ];

    // returns true when the cell at row, column is empty
    function boardIsEmptyAt(row, column) {
        return board[row][column] === 'e';
    }

    // marks a cell if not already marked
    // returns true when successfully marking a cell on the board
    // returns false otherwise
    function mark(row, column, symbol) {
        if (x < 0 || x > 2) return;
        if (y < 0 || y > 2) return;

        if (boardIsEmptyAt(row, column))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // returns true if the board is in a winning state
    // returns false otherwise
    function checkWin() {
        // check rows
        if (board[0].every(val => val === board[0][0]) &&
            board[0][0] !== 'e' ) return true;
        if (board[1].every(val => val === board[1][0]) &&
        board[1][0] !== 'e' ) return true;
        if (board[2].every(val => val === board[2][0]) &&
        board[2][0] !== 'e' ) return true;

        // check columns
        if (board[0][0] === board[1][0] &&
            board[1][0] === board[2][0] &&
            board[0][0] !== 'e') return true;
        if (board[0][1] === board[1][1] &&
            board[1][1] === board[2][1] &&
            board[0][1] !== 'e') return true;
        if (board[0][2] === board[1][2] &&
            board[1][2] === board[2][2] &&
            board[0][2] !== 'e') return true;

        // check diagonals
        if (board[0][0] === board[1][1] &&
            board[1][1] === bpard[2][2] &&
            board[0][0] !== 'e') return true;
        if (board[0][2] === board[1][1] &&
            board[1][1] === board[2][0] &&
            board[0][2] !== 'e') return true;

        return false;
    }

    // returns true in the case of a tie
    function checkTie() {
        for (let i = 0; i < board.length; i++)
        {
            for (let j = 0; j < board[0].length; j++)
            {
                if (board[i][j] === 'e') return false;
            }
        }

        return true;
    }

    // resets the board to its original state
    function reset() {
        board = [
            ['e', 'e', 'e'],
            ['e', 'e', 'e'],
            ['e', 'e', 'e']
        ];
    }

    function get() {
        return board;
    }

    return {
        mark, checkWin, checkTie, reset, get
    };
})();

// displayController module
const displayController = (() => {
    function createEmptyCell(row, column) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-row', row.toString());
        cell.setAttribute('data-column', column.toString());

        const symbol = document.createElement('p');
        symbol.classList.add('symbol');
        cell.appendChild(symbol);

        return cell;
    }

    function createEmptyBoard() {
        const physical_board = document.createElement('div');
        physical_board.classList.add('board');

        const logical_board = gameBoard.get();
        for (let i = 0; i < logical_board.length; i++)
        {
            for (let j = 0; j < logical_board[0].length; j++)
            {
                let cell = createEmptyCell(i, j);
                physical_board.appendChild(cell);
            }
        }

        return physical_board;
    }

    function displayBoard() {

    }

    function displayWinningMessage(player) {

    }

    function displayPlayer1(player) {

    }

    function displayPlayer2(player) {

    }

    return {
        displayBoard, displayPlayer1, displayPlayer2, displayWinningMessage,
        createEmptyBoard
    };
})();

function playerFactory(name, symbol) {
    return {
        name, symbol
    };
}

const gameController = (() => {
    const player1El = document.getElementById('player1');
    const player2El = document.getElementById('player2');
    const container = document.getElementsByClassName('container').item(0);

    // show the modal to select player names
    const playerInfoDialog = document.getElementById('player-info-dialog');
    playerInfoDialog.showModal();

    const playerInfoForm = document.getElementById('player-info-form');
    playerInfoForm.addEventListener('submit', () => {
        const player1Name = document.getElementsByName('player1').item(0).value;
        const player2Name = document.getElementsByName('player2').item(0).value;

        player1El.innerText = player1Name;
        player2El.innerText = player2Name;
        player1El.classList.toggle('highlight');

        const player1 = playerFactory(player1Name, 'X');
        const player2 = playerFactory(player2Name, 'O');

        const gameBoardEl = displayController.createEmptyBoard();
        container.appendChild(gameBoardEl);

        container.classList.toggle('not-visible');
    });
})();
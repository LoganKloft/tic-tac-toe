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
        if (row < 0 || row > 2) return;
        if (column < 0 || column > 2) return;

        if (boardIsEmptyAt(row, column))
        {
            board[row][column] = symbol;
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
            board[1][1] === board[2][2] &&
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
        symbol.innerText = '\u00A0';
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

    const winDialog = document.getElementById('win-dialog');
    function showWinDialog(player)
    {
        const winTextEl = document.getElementById('win-text');
        winTextEl.innerText = `${player.name} wins!`;
        winDialog.showModal();
    }

    const tieDialog = document.getElementById('tie-dialog');
    function showTieDialog() {
        tieDialog.showModal();
    }

    const restartGameForms = document.getElementsByClassName('restart-game-form');
    for (form of restartGameForms) {
        form.addEventListener('submit', () => {
            gameController.restart();
        })
    }

    return {
        createEmptyBoard, showWinDialog, showTieDialog
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
    let player1;
    let player2;
    let currentPlayer;
    const container = document.getElementsByClassName('container').item(0);
    let gameBoardEl;

    // show the modal to select player names
    const playerInfoDialog = document.getElementById('player-info-dialog');
    playerInfoDialog.showModal();

    const playerInfoForm = document.getElementById('player-info-form');
    playerInfoForm.addEventListener('submit', initialize);
    
    function restart() {
        // remove physical gameboard
        container.removeChild(gameBoardEl);
        gameBoardEl = null;

        // reset logical gameBoard
        gameBoard.reset();

        // make container invisible
        container.classList.toggle('not-visible');

        // remove highlight from players
        player1El.classList.remove('highlight');
        player2El.classList.remove('highlight');

        // show playerInfoDialog
        playerInfoDialog.showModal();
    }

    function initialize() {
        // create players
        const player1Name = document.getElementsByName('player1').item(0).value;
        const player2Name = document.getElementsByName('player2').item(0).value;

        player1El.innerText = player1Name;
        player2El.innerText = player2Name;
        player1El.classList.toggle('highlight');

        player1 = playerFactory(player1Name, 'X');
        player2 = playerFactory(player2Name, 'O');
        currentPlayer = player1;

        gameBoardEl = displayController.createEmptyBoard();
        container.appendChild(gameBoardEl);

        container.classList.toggle('not-visible');

        // add event listeners for clicking a tile
        for (child of gameBoardEl.children) {
            child.addEventListener('click', handleCellClick)
        }
    }

    function nextPlayerTurn()
    {
        if (currentPlayer == player1)
        {
            currentPlayer = player2;
        }
        else
        {
            currentPlayer = player1;
        }

        player1El.classList.toggle('highlight');
        player2El.classList.toggle('highlight');
    }

    function handleCellClick(e) {
        const cell = e.target;
        const row = cell.getAttribute('data-row');
        const column = cell.getAttribute('data-column');

        let marked = gameBoard.mark(row, column, currentPlayer.symbol);

        if (marked)
        {
            // make the mark
            cell.querySelector('.symbol').innerText = currentPlayer.symbol;

            // check for win
            if (gameBoard.checkWin())
            {
                displayController.showWinDialog(currentPlayer);
                return; // break early
            }

            // check for tie
            if (gameBoard.checkTie())
            {
                displayController.showTieDialog();
                return; // break early
            }

            nextPlayerTurn();
        }
    }

    return { restart }
})();
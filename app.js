let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

const cells = document.querySelectorAll('.cell');
const currentPlayerElement = document.getElementById('currentPlayer');
const gameStatusElement = document.getElementById('gameStatus');
const victoryPopup = document.getElementById('victoryPopup');
const drawPopup = document.getElementById('drawPopup');
const victoryTitle = document.getElementById('victoryTitle');

// Initialize the game
function initGame() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
    updateDisplay();
}

function handleCellClick(index) {
    if (gameBoard[index] !== '' || !gameActive) return;

    // Place the mark
    gameBoard[index] = currentPlayer;
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer.toLowerCase(), 'fade-in');

    // Check for win or draw
    if (checkWinner()) {
        gameActive = false;
        highlightWinningCells();
        setTimeout(() => {
            showVictoryPopup(currentPlayer);
        }, 500);
    } else if (checkDraw()) {
        gameActive = false;
        setTimeout(() => {
            showDrawPopup();
        }, 500);
    } else {
        // Switch players
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateDisplay();
    }
}

function checkWinner() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameBoard[a] && 
               gameBoard[a] === gameBoard[b] && 
               gameBoard[a] === gameBoard[c];
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function highlightWinningCells() {
    winningConditions.forEach(condition => {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
        }
    });
}

function updateDisplay() {
    currentPlayerElement.textContent = `Player ${currentPlayer}'s Turn`;
    gameStatusElement.textContent = '';
    gameStatusElement.className = 'game-status';
}

function showVictoryPopup(winner) {
    victoryTitle.textContent = `Player ${winner} Wins!`;
    victoryPopup.classList.add('show');
}

function showDrawPopup() {
    drawPopup.classList.add('show');
}

function closePopup() {
    victoryPopup.classList.remove('show');
    drawPopup.classList.remove('show');
}

function playAgain() {
    closePopup();
    resetGame();
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    
    updateDisplay();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
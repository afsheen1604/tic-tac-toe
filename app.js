const gameState = {
    board: Array(9).fill(''),
    currentPlayer: 'O',
    gameActive: true,
    moveCount: 0
};

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

const elements = {
    boxes: document.querySelectorAll('.box'),
    resetBtn: document.getElementById('reset-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    modal: document.getElementById('game-modal'),
    result: document.getElementById('game-result'),
    turnIndicator: document.getElementById('turn-indicator')
};

function initGame() {
    elements.boxes.forEach((box, index) => {
        box.addEventListener('click', () => handleMove(index));
    });
    
    elements.resetBtn.addEventListener('click', resetGame);
    elements.newGameBtn.addEventListener('click', resetGame);
    
    updateTurnIndicator();
}

function handleMove(index) {
    if (!gameState.gameActive || gameState.board[index]) return;
    
    gameState.board[index] = gameState.currentPlayer;
    elements.boxes[index].textContent = gameState.currentPlayer;
    elements.boxes[index].disabled = true;
    gameState.moveCount++;
    
    if (checkWinner()) {
        endGame(`Player ${gameState.currentPlayer} Wins!`);
    } else if (gameState.moveCount === 9) {
        endGame("It's a Draw!");
    } else {
        gameState.currentPlayer = gameState.currentPlayer === 'O' ? 'X' : 'O';
        updateTurnIndicator();
    }
}

function checkWinner() {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameState.board[a] && 
               gameState.board[a] === gameState.board[b] && 
               gameState.board[a] === gameState.board[c];
    });
}

function endGame(message) {
    gameState.gameActive = false;
    elements.result.textContent = message;
    elements.modal.classList.remove('hide');
    elements.boxes.forEach(box => box.disabled = true);
}

function resetGame() {
    gameState.board.fill('');
    gameState.currentPlayer = 'O';
    gameState.gameActive = true;
    gameState.moveCount = 0;
    
    elements.boxes.forEach(box => {
        box.textContent = '';
        box.disabled = false;
    });
    
    elements.modal.classList.add('hide');
    updateTurnIndicator();
}

function updateTurnIndicator() {
    elements.turnIndicator.textContent = `Player ${gameState.currentPlayer}'s Turn`;
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
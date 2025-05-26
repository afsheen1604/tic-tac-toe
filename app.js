// Game State
let gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameMode: '', // 'single' or 'two'
    isGameActive: true,
    isPlayerTurn: true // For AI mode
};

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// DOM elements
const screens = {
    menu: document.getElementById('main-menu'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen')
};

const elements = {
    singlePlayerBtn: document.getElementById('single-player-btn'),
    twoPlayerBtn: document.getElementById('two-player-btn'),
    gameTitle: document.getElementById('game-title'),
    currentPlayerDisplay: document.getElementById('current-player'),
    resetBtn: document.getElementById('reset-btn'),
    backToMenuBtn: document.getElementById('back-to-menu'),
    gameBoard: document.getElementById('game-board'),
    gameResult: document.getElementById('game-result'),
    newGameBtn: document.getElementById('new-game-btn'),
    mainMenuBtn: document.getElementById('main-menu-btn'),
    themeSwitch: document.getElementById('theme-switch'),
    confettiContainer: document.getElementById('confetti-container')
};

// Initialize the game
function init() {
    setupEventListeners();
    setupTheme();
    showScreen('menu');
}

// Event listeners
function setupEventListeners() {
    elements.singlePlayerBtn.addEventListener('click', () => startGame('single'));
    elements.twoPlayerBtn.addEventListener('click', () => startGame('two'));
    elements.resetBtn.addEventListener('click', resetGame);
    elements.backToMenuBtn.addEventListener('click', () => showScreen('menu'));
    elements.newGameBtn.addEventListener('click', () => startGame(gameState.gameMode));
    elements.mainMenuBtn.addEventListener('click', () => showScreen('menu'));
    elements.themeSwitch.addEventListener('change', toggleTheme);
    
    // Board click handlers
    elements.gameBoard.addEventListener('click', handleCellClick);
}

// Theme management
function setupTheme() {
    const savedTheme = localStorage.getItem('tic-tac-toe-theme');
    if (savedTheme === 'dark') {
        elements.themeSwitch.checked = true;
        document.body.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    if (elements.themeSwitch.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('tic-tac-toe-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('tic-tac-toe-theme', 'light');
    }
}

// Screen management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// Game initialization
function startGame(mode) {
    gameState = {
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        gameMode: mode,
        isGameActive: true,
        isPlayerTurn: true
    };
    
    elements.gameTitle.textContent = mode === 'single' ? 'Player vs AI' : 'Two Players';
    updateCurrentPlayerDisplay();
    clearBoard();
    showScreen('game');
}

// Reset current game
function resetGame() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;
    gameState.isPlayerTurn = true;
    updateCurrentPlayerDisplay();
    clearBoard();
}

// Clear the visual board
function clearBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
}

// Handle cell clicks
function handleCellClick(event) {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;
    
    const index = parseInt(cell.dataset.index);
    
    if (!gameState.isGameActive || gameState.board[index] !== '') return;
    
    // For single player mode, only allow moves during player's turn
    if (gameState.gameMode === 'single' && !gameState.isPlayerTurn) return;
    
    makeMove(index, gameState.currentPlayer);
    
    if (gameState.isGameActive && gameState.gameMode === 'single' && gameState.currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

// Make a move
function makeMove(index, player) {
    gameState.board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.classList.add('taken');
    
    if (checkWin(player)) {
        endGame(`${player === 'X' ? 'Player X' : (gameState.gameMode === 'single' && player === 'O' ? 'AI' : 'Player O')} Wins!`);
        highlightWinningCells();
        createConfetti();
        return;
    }
    
    if (checkDraw()) {
        endGame("It's a Draw!");
        return;
    }
    
    switchPlayer();
}

// Switch players
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    gameState.isPlayerTurn = gameState.gameMode === 'two' ? true : gameState.currentPlayer === 'X';
    updateCurrentPlayerDisplay();
}

// Update current player display
function updateCurrentPlayerDisplay() {
    if (gameState.gameMode === 'single') {
        elements.currentPlayerDisplay.textContent = gameState.currentPlayer === 'X' ? "Your Turn" : "AI's Turn";
    } else {
        elements.currentPlayerDisplay.textContent = `Player ${gameState.currentPlayer}'s Turn`;
    }
}

// AI move logic (simple)
function makeAIMove() {
    if (!gameState.isGameActive) return;
    
    // Try to win
    let move = findBestMove('O');
    if (move !== -1) {
        makeMove(move, 'O');
        return;
    }
    
    // Try to block player from winning
    move = findBestMove('X');
    if (move !== -1) {
        makeMove(move, 'O');
        return;
    }
    
    // Take center if available
    if (gameState.board[4] === '') {
        makeMove(4, 'O');
        return;
    }
    
    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState.board[i] === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeMove(randomCorner, 'O');
        return;
    }
    
    // Take any available space
    const availableMoves = gameState.board.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);
    if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomMove, 'O');
    }
}

// Find best move for a player (to win or block)
function findBestMove(player) {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        const cells = [gameState.board[a], gameState.board[b], gameState.board[c]];
        
        if (cells.filter(cell => cell === player).length === 2 && cells.includes('')) {
            return combo[cells.indexOf('')];
        }
    }
    return -1;
}

// Check for win
function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameState.board[index] === player);
    });
}

// Check for draw
function checkDraw() {
    return gameState.board.every(cell => cell !== '');
}

// Highlight winning cells
function highlightWinningCells() {
    for (let combo of winningCombinations) {
        if (combo.every(index => gameState.board[index] === gameState.currentPlayer)) {
            combo.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
            break;
        }
    }
}

// End game
function endGame(result) {
    gameState.isGameActive = false;
    elements.gameResult.textContent = result;
    
    // Add congratulations message for wins
    if (result.includes('Wins')) {
        elements.gameResult.textContent = `🎉 Congratulations! ${result} 🎉`;
    }
    
    setTimeout(() => {
        showScreen('gameOver');
    }, 1500);
}

// Create confetti animation
function createConfetti() {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            elements.confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }, i * 50);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
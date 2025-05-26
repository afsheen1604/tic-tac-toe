let currentPlayer = 'X';
let gameMode = '';
let boardSize = 3;
let board = [];
let gameActive = true;
let winCondition = 3;

function selectMode(mode) {
    gameMode = mode;
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('size-selection').classList.remove('hidden');
}

function selectSize(size) {
    boardSize = size;
    winCondition = size === 3 ? 3 : size === 5 ? 4 : 5;
    document.getElementById('size-selection').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initGame();
}

function initGame() {
    board = Array(boardSize * boardSize).fill('');
    currentPlayer = 'X';
    gameActive = true;
    updateTurnDisplay();
    createBoard();
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.className = `board size-${boardSize}`;
    
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.onclick = () => makeMove(i);
        gameBoard.appendChild(cell);
    }
}

function makeMove(index) {
    if (board[index] !== '' || !gameActive) return;
    
    board[index] = currentPlayer;
    updateBoard();
    
    if (checkWinner()) {
        endGame(`Player ${currentPlayer} Wins! 🎉`);
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        endGame("It's a Draw! 🤝");
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();
    
    if (gameMode === '1player' && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex);
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.className = `cell ${board[index].toLowerCase()}`;
    });
}

function updateTurnDisplay() {
    const turnDisplay = document.getElementById('current-turn');
    if (gameMode === '1player') {
        turnDisplay.textContent = currentPlayer === 'X' ? "Your Turn" : "AI's Turn";
    } else {
        turnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    // Check rows
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col <= boardSize - winCondition; col++) {
            if (checkLine(row * boardSize + col, 1, winCondition)) return true;
        }
    }
    
    // Check columns
    for (let col = 0; col < boardSize; col++) {
        for (let row = 0; row <= boardSize - winCondition; row++) {
            if (checkLine(row * boardSize + col, boardSize, winCondition)) return true;
        }
    }
    
    // Check diagonals
    for (let row = 0; row <= boardSize - winCondition; row++) {
        for (let col = 0; col <= boardSize - winCondition; col++) {
            if (checkLine(row * boardSize + col, boardSize + 1, winCondition)) return true;
            if (checkLine(row * boardSize + col + winCondition - 1, boardSize - 1, winCondition)) return true;
        }
    }
    
    return false;
}

function checkLine(start, step, length) {
    const first = board[start];
    if (first === '') return false;
    
    for (let i = 1; i < length; i++) {
        if (board[start + i * step] !== first) return false;
    }
    
    // Highlight winning cells
    for (let i = 0; i < length; i++) {
        document.querySelectorAll('.cell')[start + i * step].classList.add('winner');
    }
    
    return true;
}

function endGame(message) {
    gameActive = false;
    document.getElementById('game-result').textContent = message;
    document.getElementById('game-over-modal').classList.remove('hidden');
}

function playAgain() {
    document.getElementById('game-over-modal').classList.add('hidden');
    initGame();
}

function resetGame() {
    initGame();
}

function goToModeSelection() {
    document.getElementById('game-over-modal').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('size-selection').classList.add('hidden');
    document.getElementById('mode-selection').classList.remove('hidden');
}

function showRules() {
    document.getElementById('rules-modal').classList.remove('hidden');
}

function closeRules() {
    document.getElementById('rules-modal').classList.add('hidden');
}
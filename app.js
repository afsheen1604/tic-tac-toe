// Game State
let game = {
    board: Array(9).fill(''),
    player: 'X',
    active: false,
    mode: null, // 'single' or 'multi'
    moves: 0
};

// Win patterns
const wins = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6] // diagonals
];

// DOM elements
const els = {
    startScreen: document.getElementById('start-screen'),
    gameContainer: document.getElementById('game-container'),
    boxes: document.querySelectorAll('.box'),
    turnIndicator: document.getElementById('turn-indicator'),
    victoryModal: document.getElementById('victory-modal'),
    victoryIcon: document.getElementById('victory-icon'),
    victoryTitle: document.getElementById('victory-title'),
    winnerBadge: document.getElementById('winner-badge'),
    resetBtn: document.getElementById('reset-btn'),
    homeBtn: document.getElementById('home-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    menuBtn: document.getElementById('menu-btn')
};

// Initialize game
function init() {
    els.boxes.forEach((box, i) => {
        box.addEventListener('click', () => makeMove(i));
    });
    
    els.resetBtn.addEventListener('click', resetGame);
    els.homeBtn.addEventListener('click', showMainMenu);
    els.playAgainBtn.addEventListener('click', resetGame);
    els.menuBtn.addEventListener('click', showMainMenu);
}

// Start game with selected mode
function startGame(mode) {
    game.mode = mode;
    game.active = true;
    els.startScreen.classList.add('hide');
    els.gameContainer.classList.remove('hide');
    updateTurnIndicator();
}

// Make a move
function makeMove(index) {
    if (!game.active || game.board[index]) return;
    
    game.board[index] = game.player;
    els.boxes[index].textContent = game.player;
    els.boxes[index].disabled = true;
    game.moves++;
    
    if (checkWin()) {
        endGame(`Player ${game.player} Wins!`);
    } else if (game.moves === 9) {
        endGame("It's a Draw!");
    } else {
        switchPlayer();
        if (game.mode === 'single' && game.player === 'O') {
            setTimeout(botMove, 500);
        }
    }
}

// Bot move (simple AI)
function botMove() {
    if (!game.active) return;
    
    // Try to win
    let move = findWinningMove('O');
    if (move === -1) {
        // Block player
        move = findWinningMove('X');
        if (move === -1) {
            // Take center or random
            move = game.board[4] === '' ? 4 : getRandomMove();
        }
    }
    
    if (move !== -1) {
        makeMove(move);
    }
}

// Find winning move for player
function findWinningMove(player) {
    for (let pattern of wins) {
        const [a, b, c] = pattern;
        const line = [game.board[a], game.board[b], game.board[c]];
        
        if (line.filter(cell => cell === player).length === 2 && line.includes('')) {
            return pattern[line.indexOf('')];
        }
    }
    return -1;
}

// Get random available move
function getRandomMove() {
    const available = game.board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : -1;
}

// Check for win
function checkWin() {
    return wins.some(pattern => {
        const [a, b, c] = pattern;
        return game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c];
    });
}

// Switch player
function switchPlayer() {
    game.player = game.player === 'X' ? 'O' : 'X';
    updateTurnIndicator();
}

// Update turn indicator
function updateTurnIndicator() {
    const playerName = game.mode === 'single' && game.player === 'O' ? 'Computer' : `Player ${game.player}`;
    els.turnIndicator.textContent = `${playerName}'s Turn`;
}

// End game with epic victory screen
function endGame(result) {
    game.active = false;
    els.boxes.forEach(box => box.disabled = true);
    
    if (result.includes('Draw')) {
        els.victoryTitle.textContent = 'EPIC DRAW!';
        els.winnerBadge.textContent = 'Perfectly Matched!';
        els.victoryIcon.querySelector('.crown').textContent = '⚡';
        // Change winner badge color for draw
        els.winnerBadge.style.background = 'linear-gradient(135deg, rgba(84, 134, 135, 0.8) 0%, rgba(84, 134, 135, 0.6) 100%)';
        // Different vibration pattern for draw
        navigator.vibrate && navigator.vibrate([100, 50, 100, 50, 100]);
    } else {
        const winner = game.player;
        const winnerName = game.mode === 'single' && winner === 'O' ? 'Computer' : `Player ${winner}`;
        
        els.victoryTitle.textContent = 'VICTORY!';
        els.winnerBadge.textContent = `${winnerName} Dominates!`;
        els.victoryIcon.querySelector('.crown').textContent = winner === 'X' ? '👑' : '🏆';
        // Reset winner badge color for wins
        els.winnerBadge.style.background = 'linear-gradient(135deg, rgba(176, 65, 62, 0.8) 0%, rgba(176, 65, 62, 0.6) 100%)';
        // Victory vibration
        navigator.vibrate && navigator.vibrate([200, 100, 200]);
    }
    
    els.victoryModal.classList.remove('hide');
}

// Reset game
function resetGame() {
    game.board.fill('');
    game.player = 'X';
    game.active = true;
    game.moves = 0;
    
    els.boxes.forEach(box => {
        box.textContent = '';
        box.disabled = false;
    });
    
    els.victoryModal.classList.add('hide');
    updateTurnIndicator();
}

// Show main menu
function showMainMenu() {
    els.gameContainer.classList.add('hide');
    els.victoryModal.classList.add('hide');
    els.startScreen.classList.remove('hide');
    resetGame();
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', init);
class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X'; // X is human, O is bot
        this.gameActive = true;
        this.playerScore = 0;
        this.botScore = 0;
        this.tiesScore = 0;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeGame();
    }

    initializeGame() {
        this.createBoard();
        this.attachEventListeners();
        this.updateTurnIndicator();
    }

    createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            boardElement.appendChild(cell);
        }
    }

    attachEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('reset-score-btn').addEventListener('click', () => this.resetScore());
    }

    handleCellClick(e) {
        const index = e.target.dataset.index;
        
        if (!this.gameActive || this.currentPlayer !== 'X' || this.board[index] !== '') {
            return;
        }

        // Human move
        this.makeMove(index, 'X');
        
        if (this.gameActive) {
            // Bot moves immediately
            setTimeout(() => this.botMove(), 500);
        }
    }

    botMove() {
        if (!this.gameActive || this.currentPlayer !== 'O') return;
        
        const bestMove = this.getBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove, 'O');
        }
    }

    getBestMove() {
        // First, check if bot can win
        for (let combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] === 'O' && this.board[b] === 'O' && this.board[c] === '') return c;
            if (this.board[a] === 'O' && this.board[c] === 'O' && this.board[b] === '') return b;
            if (this.board[b] === 'O' && this.board[c] === 'O' && this.board[a] === '') return a;
        }

        // Then, block human's winning move
        for (let combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] === 'X' && this.board[b] === 'X' && this.board[c] === '') return c;
            if (this.board[a] === 'X' && this.board[c] === 'X' && this.board[b] === '') return b;
            if (this.board[b] === 'X' && this.board[c] === 'X' && this.board[a] === '') return a;
        }

        // Take center if available
        if (this.board[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(i => this.board[i] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }

        return -1; // No moves available
    }

    makeMove(index, player) {
        if (this.board[index] !== '' || !this.gameActive) return;

        this.board[index] = player;
        this.updateCell(index, player);
        
        const result = this.checkGameStatus();
        
        if (result) {
            this.handleGameEnd(result);
        } else {
            this.currentPlayer = player === 'X' ? 'O' : 'X';
            this.updateTurnIndicator();
        }
    }

    updateCell(index, player) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        cell.classList.add('disabled');
    }

    checkGameStatus() {
        // Check for win
        for (let combo of this.winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return { type: 'win', player: this.board[a], combination: combo };
            }
        }

        // Check for tie
        if (!this.board.includes('')) {
            return { type: 'tie' };
        }

        return null;
    }

    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result.type === 'win') {
            this.highlightWinningCombination(result.combination);
            
            if (result.player === 'X') {
                // This should never happen with our bot, but just in case
                this.playerScore++;
                this.showMessage('🎉 You won? That\'s impossible! 🎉');
            } else {
                this.botScore++;
                this.showLOL();
            }
        } else {
            this.tiesScore++;
            this.showMessage('🤔 It\'s a tie! The bot will get you next time! 🤔');
        }
        
        this.updateScores();
        this.disableAllCells();
    }

    highlightWinningCombination(combination) {
        combination.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('winning');
        });
    }

    showLOL() {
        const lolContainer = document.getElementById('lol-container');
        lolContainer.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            lolContainer.style.display = 'none';
        }, 3000);
    }

    showMessage(message) {
        // You can implement a toast or notification here
        console.log(message);
    }

    disableAllCells() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.add('disabled'));
    }

    updateTurnIndicator() {
        const indicator = document.querySelector('.turn-indicator');
        if (this.gameActive) {
            indicator.textContent = this.currentPlayer === 'X' ? 'Your Turn' : 'Bot is thinking...';
            indicator.style.animation = this.currentPlayer === 'X' ? 'pulse 1.5s infinite' : 'none';
        } else {
            indicator.textContent = 'Game Over';
        }
    }

    updateScores() {
        document.getElementById('player-score').textContent = this.playerScore;
        document.getElementById('bot-score').textContent = this.botScore;
        document.getElementById('ties-score').textContent = this.tiesScore;
    }

    restartGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear board
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'disabled', 'winning');
        });
        
        // Hide LOL container
        document.getElementById('lol-container').style.display = 'none';
        
        this.updateTurnIndicator();
    }

    resetScore() {
        this.playerScore = 0;
        this.botScore = 0;
        this.tiesScore = 0;
        this.updateScores();
        this.restartGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
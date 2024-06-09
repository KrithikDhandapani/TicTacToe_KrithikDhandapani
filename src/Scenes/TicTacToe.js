class ScoreKeeper {
    constructor() {
        this.playerXScore = 0;
        this.playerOScore = 0;
    }

    incrementPlayerXScore() {
        this.playerXScore++;
    }

    incrementPlayerOScore() {
        this.playerOScore++;
    }

    getPlayerXScore() {
        return this.playerXScore;
    }

    getPlayerOScore() {
        return this.playerOScore;
    }
}

class TicTacToe extends Phaser.Scene {
    constructor() {
        super("TicTacToe");

        // Initialize the game board and the current player
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = 'X';  // Player starts as 'X'
        this.gameOver = false;

        // Initialize the score keeper
        this.scoreKeeper = new ScoreKeeper();
    }

    preload() {
        this.load.setPath("./assets/");

        // Load the background image
        this.load.image('board', 'TicTacToeBoard.jpg');

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>Tic Tac Toe<br>Click on a cell to make your move</h2>';
    }

    create() {
        // Add the background image
        this.add.image(300, 300, 'board');

        // Create the 3x3 grid for the game
        this.gridSize = 200;  // Size of each cell
        this.grid = [];

        // Define cell coordinates to match the background image
        const cellCoordinates = [
            [{ x: 150, y: 150 }, { x: 300, y: 150 }, { x: 450, y: 150 }],
            [{ x: 150, y: 300 }, { x: 300, y: 300 }, { x: 450, y: 300 }],
            [{ x: 150, y: 450 }, { x: 300, y: 450 }, { x: 450, y: 450 }]
        ];

        // Create interactive cells based on the coordinates
        for (let row = 0; row < 3; row++) {
            this.grid[row] = [];
            for (let col = 0; col < 3; col++) {
                let cellX = cellCoordinates[row][col].x;
                let cellY = cellCoordinates[row][col].y;
                let cell = this.add.rectangle(cellX, cellY, this.gridSize, this.gridSize, 0xffffff, 0).setInteractive();
                cell.row = row;
                cell.col = col;
                this.grid[row][col] = cell;

                // Handle click on cell
                cell.on('pointerdown', () => {
                    if (this.board[row][col] === '' && !this.gameOver) {
                        this.makeMove(row, col, this.currentPlayer);
                        if (!this.gameOver) {
                            this.currentPlayer = 'O';
                            // Delay AI move by 1 second
                            this.time.delayedCall(1000, () => {
                                this.aiMove();
                                if (!this.gameOver) {
                                    this.currentPlayer = 'X';
                                }
                            });
                        }
                    }
                });
            }
        }

        // Add the R key listener for restarting the game
        this.rKey = this.input.keyboard.addKey('R');

        // Display the scores
        this.playerXScoreText = this.add.text(650, 200, 'Player X: ' + this.scoreKeeper.getPlayerXScore(), { fontSize: '40px', fill: '#FFA500' });
        this.playerOScoreText = this.add.text(650, 400, 'Player O: ' + this.scoreKeeper.getPlayerOScore(), { fontSize: '40px', fill: '#FFA500' });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.restartGame();
        }
    }

    restartGame() {
        // Reset the game state
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = 'X';
        this.gameOver = false;
        
        // Clear the existing text from the scene
        this.children.removeAll();

        // Recreate the scene
        this.create();
    }

    makeMove(row, col, player) {
        // Update board and grid with player's move
        this.board[row][col] = player;
        let cellX = this.grid[row][col].x;
        let cellY = this.grid[row][col].y;
        this.add.text(cellX, cellY, player, { fontSize: '128px', color: '#000' }).setOrigin(0.5);

        // Check for win or draw
        if (this.checkWin(player)) {
            this.gameOver = true;
            let resultText = player === 'X' ? 'YOU WIN' : 'YOU LOSE';
            let resultColor = player === 'X' ? '#00ff00' : '#ff0000';
            this.add.text(300, 50, resultText, { fontSize: '64px', color: resultColor }).setOrigin(0.5);
            this.add.text(300, 550, 'Press R to restart', { fontSize: '32px', color: '#0000FF' }).setOrigin(0.5);

            // Update the score
            if (player === 'X') {
                this.scoreKeeper.incrementPlayerXScore();
            } else {
                this.scoreKeeper.incrementPlayerOScore();
            }

            // Update the score display
            this.playerXScoreText.setText('Player X: ' + this.scoreKeeper.getPlayerXScore());
            this.playerOScoreText.setText('Player O: ' + this.scoreKeeper.getPlayerOScore());

        } else if (this.checkDraw()) {
            this.gameOver = true;
            this.add.text(300, 50, 'IT\'S A DRAW', { fontSize: '64px', color: '#000' }).setOrigin(0.5);
            this.add.text(300, 550, 'Press R to restart', { fontSize: '32px', color: '#0000FF' }).setOrigin(0.5);
        }
    }

    aiMove() {
        // First, check if AI can win
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === '') {
                    this.board[row][col] = 'O';
                    if (this.checkWin('O')) {
                        this.makeMove(row, col, 'O');
                        return;
                    } else {
                        this.board[row][col] = '';
                    }
                }
            }
        }

        // Next, check if AI can block X from winning
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === '') {
                    this.board[row][col] = 'X';
                    if (this.checkWin('X')) {
                        this.board[row][col] = 'O';
                        this.makeMove(row, col, 'O');
                        return;
                    } else {
                        this.board[row][col] = '';
                    }
                }
            }
        }

        // If neither, pick a random move
        let emptyCells = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === '') {
                    emptyCells.push({ row: row, col: col });
                }
            }
        }

        if (emptyCells.length > 0) {
            let move = Phaser.Utils.Array.GetRandom(emptyCells);
            this.makeMove(move.row, move.col, 'O');
        }
    }

    checkWin(player) {
        // Check rows, columns, and diagonals for a win
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === player && this.board[i][1] === player && this.board[i][2] === player) {
                return true;
            }
            if (this.board[0][i] === player && this.board[1][i] === player && this.board[2][i] === player) {
                return true;
            }
        }
        if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) {
            return true;
        }
        if (this.board[0][2] === player && this.board[1][1] === player && this.board[2][0] === player) {
            return true;
        }
        return false;
    }

    checkDraw() {
        // Check if all cells are filled
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] === '') {
                    return false;
                }
            }
        }
        return true;
    }
}

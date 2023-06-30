import { Player, GameState } from './player.js';
import { BoardPosition, PlayerMoveFunction } from './types';  // If types are in a different file

const positionToIndices = (position: BoardPosition): [number, number] => {
  const row = Math.floor(position / 3);
  const col = position % 3;
  return [row, col];
};

export class Game {
    board: string[][];
    players: Player[];
    currentPlayerIndex: number;
    delay: number;
    moveLog: any[]; // You can replace `any` with a specific type for a move
    moveTimes: number[];

    constructor(player1: Player, player2: Player, initialPlayer: number, delay = 1000) {
        this.board = Array(3).fill(null).map(() => Array(3).fill(' '));
        this.players = [player1, player2];
        this.currentPlayerIndex = initialPlayer;
        this.delay = delay;
        this.moveLog = [];
        this.moveTimes = [];
    }

		getBoardPositions(playerSymbol: string): BoardPosition[] {
			let positions = [];
	
			for (let i = 0; i < 9; i++) {
				const [row, col] = positionToIndices(i);
				if (this.board[row][col] === playerSymbol) {
					positions.push(i);
				}
			}
	
			return positions;
		}

		async play() {
			let gameState = 'ongoing';
			while (gameState === 'ongoing') {
				gameState = await this.playTurn();
				await new Promise(resolve => setTimeout(resolve, this.delay));
			}
			return gameState;
		}

		async playTurn(): Promise<string> {
			const currentPlayer = this.players[this.currentPlayerIndex];
			const xPositions = this.getBoardPositions('X');
			const oPositions = this.getBoardPositions('O');
	
			const move = await currentPlayer.makeMove(xPositions, oPositions, currentPlayer.symbol);
	
			if (this.isValidMove(move)) {
				const [row, col] = positionToIndices(move);
				this.board[row][col] = currentPlayer.symbol;
				const gameState = this.checkGameState();
				if (gameState !== 'ongoing') {
					this.endGame(gameState);
					return gameState;
				} else {
					this.switchPlayer();
				}
			} else {
				this.endGame(this.players[1 - this.currentPlayerIndex].symbol);  // The other player wins
				return this.players[1 - this.currentPlayerIndex].symbol;
			}
			return 'ongoing';
		}

		isValidMove(move: BoardPosition) {
			const [row, col] = positionToIndices(move);
			// Check that the move is within the board and that the cell is currently empty
			return row >= 0 && row < 3 && col >= 0 && col < 3 && this.board[row][col] === ' ';
		}

    switchPlayer() {
			this.currentPlayerIndex = 1 - this.currentPlayerIndex; // Switches between 0 and 1
		}
	
		// You should implement this
		checkGameState() {
			const winLines = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6]
			];
	
			for (let line of winLines) {
				const [i, j, k] = line;
				const [row1, col1] = positionToIndices(i);
				const [row2, col2] = positionToIndices(j);
				const [row3, col3] = positionToIndices(k);
				if (this.board[row1][col1] === this.board[row2][col2] && 
						this.board[row1][col1] === this.board[row3][col3] && 
						this.board[row1][col1] !== ' ') {
					return this.board[row1][col1];  // Returns 'X' or 'O'
				}
			}
	
			if (this.board.flat().every((cell) => cell !== ' ')) {
				return 'draw';
			}
	
			return 'ongoing';
		}

		endGame(winner: string) {
			// You may want to store the result somewhere, log it, or handle it in some other way
			console.log(`Game over. Winner: ${winner}`);
		}
}

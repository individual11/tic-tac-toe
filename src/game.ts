import { BoardPosition, Move, Player } from './types';  // If types are in a different file

import { printBoard } from './helpers';

enum GameStatus {
  ONGOING = 'ongoing',
  OVER = 'over'
}

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
	moveLog: Move[]; // You can replace `any` with a specific type for a move
	status: GameStatus;
	winner: Player | 'draw' | undefined;
  illegalMove: Move | undefined;

	constructor(player1: Player, player2: Player, delay = 1000) {
		this.board = Array(3).fill(null).map(() => Array(3).fill(' '));
		this.players = [player1, player2];
		this.currentPlayerIndex = 0;
		this.delay = delay;
		this.moveLog = [];
		this.status = GameStatus.ONGOING;
		this.winner = undefined;
    this.illegalMove = undefined;
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

	async play(): Promise<void> {
		while (this.status === GameStatus.ONGOING) {
			await this.playTurn();
			await new Promise(resolve => setTimeout(resolve, this.delay));
		}
	}

	async playTurn(): Promise<void> {
		const currentPlayer = this.players[this.currentPlayerIndex];
		const xPositions = this.getBoardPositions('X');
		const oPositions = this.getBoardPositions('O');
		const move = await currentPlayer.makeMove(xPositions, oPositions, currentPlayer.symbol);
		const currentMove: Move = {player: currentPlayer, position: move};

		console.log("MOVE:", `${currentPlayer.name} places ${currentPlayer.symbol} at ${move}`);

		if (this.isValidMove(move)) {
			const [row, col] = positionToIndices(move);
			this.board[row][col] = currentPlayer.symbol;
			this.moveLog.push(currentMove);

			// Log the move
			// console.log(`Player ${currentPlayer.name} makes move at position ${move}:`);
			console.log(printBoard(this.board));

			const gameState = this.checkGameState();
			if (gameState !== GameStatus.ONGOING) {

				this.status = GameStatus.OVER;
				this.winner = gameState === 'draw' ? 'draw' : currentPlayer;
			} else {
				this.switchPlayer();
			}
		} else { // an invalid move was played
			console.log(`PLAYER: ${currentPlayer.name} played an illegal move and was disqualified.`)
			this.status = GameStatus.OVER;
      this.winner = this.players[1 - this.currentPlayerIndex];
      this.illegalMove = currentMove;
		}
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
	checkGameState(): string {
		const winningCombinations = [
			// Rows
			[[0, 0], [0, 1], [0, 2]],
			[[1, 0], [1, 1], [1, 2]],
			[[2, 0], [2, 1], [2, 2]],
			// Columns
			[[0, 0], [1, 0], [2, 0]],
			[[0, 1], [1, 1], [2, 1]],
			[[0, 2], [1, 2], [2, 2]],
			// Diagonals
			[[0, 0], [1, 1], [2, 2]],
			[[0, 2], [1, 1], [2, 0]],
		];
	
		for (let combination of winningCombinations) {
			const [c1, c2, c3] = combination;
			if (
				this.board[c1[0]][c1[1]] === this.board[c2[0]][c2[1]] &&
				this.board[c1[0]][c1[1]] === this.board[c3[0]][c3[1]] &&
				this.board[c1[0]][c1[1]] !== ' '
			) {
				// We have a winner
				return this.board[c1[0]][c1[1]];
			}
		}
	
		// Check if any cell is empty (i.e., game is still ongoing)
		for (let row of this.board) {
			if (row.includes(' ')) return GameStatus.ONGOING;
		}
	
		// All cells are filled and no winning combination is found, hence it's a draw
		return 'draw';
	}
	

	endGame(winner: Player) {
		// You may want to store the result somewhere, log it, or handle it in some other way
		console.log(`Game over. Winner: ${winner.name}`);
	}
}

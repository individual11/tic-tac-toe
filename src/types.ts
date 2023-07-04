export type BoardPosition = number;  // range from 0 to 8

export interface PlayerMoveFunction {
  (xPositions: BoardPosition[], oPositions: BoardPosition[], currentPlayer: string): BoardPosition;
}

export interface Player {
	name: string;
	symbol: string; // 'X' or 'O'
	makeMove: PlayerMoveFunction;
	id: string;
}

export interface Move {
	player: Player;
	position: BoardPosition;
};
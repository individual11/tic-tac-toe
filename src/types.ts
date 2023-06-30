export type BoardPosition = number;  // range from 0 to 8

export interface PlayerMoveFunction {
  (xPositions: BoardPosition[], oPositions: BoardPosition[], currentPlayer: string): BoardPosition;
}
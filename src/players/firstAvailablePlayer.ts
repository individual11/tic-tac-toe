export default function firstAvailablePlayer(xPositions: number[], oPositions: number[], currentPlayer: string): number {
  const occupied = new Set([...xPositions, ...oPositions]);

  for (let i = 0; i < 9; i++) {
    if (!occupied.has(i)) {
      return i;
    }
  }

  return -1;  // This should never be reached if the game checks for a draw before asking for a move
}
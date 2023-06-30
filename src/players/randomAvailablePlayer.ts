export default function randomAvailablePlayer(xPositions: number[], oPositions: number[], currentPlayer: string): number {
  const occupied = new Set([...xPositions, ...oPositions]);
  const available = [];

  for (let i = 0; i < 9; i++) {
    if (!occupied.has(i)) {
      available.push(i);
    }
  }

  return available[Math.floor(Math.random() * available.length)];
}

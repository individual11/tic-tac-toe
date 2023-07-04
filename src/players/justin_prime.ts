type PlayerMoveFunction = (xPositions: number[], oPositions: number[], mySymbol: string) => number;

const winningCombos = [
	[0,1,2], // top row
	[3,4,5], // middle row
	[6,7,8], // bottom row
	[0,3,6], // left column
	[1,4,7], // middle column
	[2,5,8], // right column
	[0,4,8], // right diagonal
	[2,4,6]  // left diagonal
]

const idealOffensiveMoves = [0,2,4,6,8];

const makeMove: PlayerMoveFunction = (xPositions, oPositions, mySymbol) => {
	const myPositions = mySymbol === 'X' ? xPositions : oPositions;
	const enemyPositions = mySymbol === 'X' ? oPositions : xPositions;

	// Try to complete a winning line
	for (const combo of winningCombos) {
			const myMovesInCombo = combo.filter(pos => myPositions.includes(pos));
			if (myMovesInCombo.length === 2) {
					const winningMove = combo.find(pos => !myPositions.includes(pos) && !enemyPositions.includes(pos));
					if (winningMove !== undefined) {
							return winningMove;
					}
			}
	}

	// Try to make an ideal offensive move
	for (const move of idealOffensiveMoves) {
			if (!myPositions.includes(move) && !enemyPositions.includes(move)) {
					return move;
			}
	}

	// Otherwise, choose the first available cell
	for (let i = 0; i < 9; i++) {
			if (!myPositions.includes(i) && !enemyPositions.includes(i)) {
					return i;
			}
	}

	throw new Error('No available moves to make');
}

export default makeMove;
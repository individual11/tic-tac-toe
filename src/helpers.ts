export function printBoard(board: string[][]): string {
	return board.map((row) => row.join('|')).join('\n-+-+-\n')
}

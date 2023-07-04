const makeMove = (xPositions: number[], oPositions: number[], mySymbol: 'X' | 'O') => {
	const takenPositions: number[] = [...xPositions, ...oPositions];
​
	const openPositions: number[] = []
​
	for (let i: number = 0; i < 9; i++) {
		if (!takenPositions.includes(i)) {
			openPositions.push(i)
		}
	}
​
	const corners = [0, 2, 6, 8]
	const otherPositions = [1, 3, 5, 7]
​
	// if taken positions dont include the middle go take it
	if (!openPositions.includes(4)) {
		return 4
	}
​
	// go get the first available corner
	for (let i = 0; i < corners.length; i++) {
		if (openPositions.includes(corners[i])) {
			return corners[i];
		}
	}
​
	// go get the first available position that isn't a corner
	for (let i = 0; i < otherPositions.length; i++) {
		if (openPositions.includes(otherPositions[i])) {
			return otherPositions[i];
		}
	}
​
	// take whats left
	return openPositions[0]
}
​
​
export default makeMove;
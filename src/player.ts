import fs from 'fs';
import path from 'path';

import { BoardPosition, PlayerMoveFunction } from './types';

export interface Player {
	name: string;
	symbol: string; // 'X' or 'O'
	makeMove: PlayerMoveFunction
}

export interface GameState {
	xPositions: [number];
	oPositions: [number];
	currentPlayer: string;
}


export class Player {
  symbol: string;
  makeMove!: PlayerMoveFunction;

  constructor(symbol: string, playerFunctionPath: string) {
    this.symbol = symbol;
    import(playerFunctionPath).then((module) => {
      this.makeMove = module.default;
    });
  }
}

export function loadPlayerFunctions(): { [name: string]: string } {
	const playerDir = path.join(__dirname, './players');
	const playerFiles = fs.readdirSync(playerDir).filter(file => file.endsWith('.js'));

	const players: { [name: string]: string } = {};

	for (const file of playerFiles) {
			const playerPath = path.join(playerDir, file);
			
			// We store the path of each player file
			players[file.replace('.js', '')] = playerPath;
	}

	// console.log(players, typeof players, Object.entries(players))
	// Object.entries(players).map(entry => {
	// 	const [name, value] = entry;
	// 	console.log(name);
	// })
	return players;
}
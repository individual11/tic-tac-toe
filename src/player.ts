import fs from 'fs';
import path from 'path';

import { BoardPosition, PlayerMoveFunction } from './types';

export interface Player {
	name: string;
	symbol: string; // 'X' or 'O'
	makeMove: PlayerMoveFunction;
	id: string;
}

export class Player {
  symbol: string;
	name: string;
	id: string;
  makeMove!: PlayerMoveFunction;

  constructor(id: string, name: string, symbol: string, playerFunctionPath: string) {
    this.name = name;
		this.symbol = symbol;
		this.id = id;
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

	return players;
}
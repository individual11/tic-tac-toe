import { Player } from './player.js';
import { Game } from './game.js';
import { printBoard } from './helpers';
import fs from 'fs';

export class Round {
	players: Player[];
	gamesCount: number;
	delay: number;
	decideFirstPlayer: (results: any[], currentGameNumber: number) => number; // You can replace `any` with the type of a game result
	gameResults: any[]; // You can replace `any` with the type of a game result
	currentGameNumber: number;
	score: { [key: string]: number };  // New property

	constructor(player1: Player, player2: Player, gamesCount: number, delay: number, decideFirstPlayer: (results: any[], currentGameNumber: number) => number) {
		this.players = [player1, player2];
		this.gamesCount = gamesCount;
		this.delay = delay;
		this.decideFirstPlayer = decideFirstPlayer;
		this.gameResults = [];
		this.currentGameNumber = 0;
		this.score = { [this.players[0].id]: 0, [this.players[1].id]: 0, 'draw': 0 };

	}

	async playAllGames() {
		console.log('Starting round...');

		for (let i = 0; i < this.gamesCount; i++) {
			this.currentGameNumber = i;

			const firstPlayerIndex = this.decideFirstPlayer(this.gameResults, this.currentGameNumber);
			const firstPlayer = this.players[firstPlayerIndex];
			const secondPlayer = this.players[(firstPlayerIndex + 1) % 2]; // The other player

			const game = new Game(firstPlayer, secondPlayer, this.delay);
			await game.play(); // Assuming 'play' returns game result
			if (game.illegalMove) {
				console.log(`Game over due to illegal move at position ${game.illegalMove.position} by ${game.illegalMove.player.name}.`);
			}
			this.gameResults.push(game);
			// Update the score
			if (typeof game.winner === 'string') {  // If it's a draw
				this.score['draw']++;
			} else {  // If a player won
				this.score[game.winner.id]++;
			}
		}

		// Determine the round winner
		if (this.score[this.players[0].id] === this.score[this.players[1].id]) {
			console.log(`Round finished! The result is a draw`);
		} else {
			const winningPlayer = this.score[this.players[0].id] > this.score[this.players[1].id] ? this.players[0] : this.players[1];
			const roundWinner = winningPlayer.name;
			console.log(`Round finished! The winner is ${roundWinner} with a score of ${this.score[winningPlayer.id]}.`);
		}

		// write to file
		this.writeRoundSummaryToMarkdown();
	}


	// Writes a summary of the round to a Markdown file
	writeRoundSummaryToMarkdown() {
		let markdownText = `# Round Summary\n\nPlayers: ${this.players[0].name} vs ${this.players[1].name}\n\n`;

		for (let i = 0; i < this.gameResults.length; i++) {
			markdownText += `## Game ${i + 1}\n\n`;
			if (this.gameResults[i].illegalMove) {
				markdownText += `Game ended due to illegal move. Winner: **${this.gameResults[i].winner.name}**\n\n`;
				markdownText += `Illegal move at position ${this.gameResults[i].illegalMove.position} by ${this.gameResults[i].illegalMove.player.name}\n\n`;
			} else {
				markdownText += `Winner: **${this.gameResults[i].winner.name}**\n\n`;
			}

			markdownText += 'Moves:\n\n';

			for (let j = 0; j < this.gameResults[i].moveLog.length; j++) {
				markdownText += `- Player **${this.gameResults[i].moveLog[j].player.name}** moved to position **${this.gameResults[i].moveLog[j].position}**\n`;
			}

			markdownText += '\nFinal Board State:\n\n';
			markdownText += '```\n';  // Start a code block
			markdownText += printBoard(this.gameResults[i].board);
			markdownText += '\n```\n';  // End the code block

			markdownText += '\n';
		}

		const player1Name = this.players[0].name.replace(/\s/g, '_');
		const player2Name = this.players[1].name.replace(/\s/g, '_');

		const fileName = `rounds/${player1Name}_vs_${player2Name}_${new Date().getTime()}.md`;
		fs.writeFileSync(fileName, markdownText);
	}

}

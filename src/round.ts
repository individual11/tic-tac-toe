import { Player } from './player.js';
import { Game } from './game.js';

export class Round {
    players: Player[];
    gamesCount: number;
    delay: number;
    decideFirstPlayer: (results: any[], currentGameNumber: number) => number; // You can replace `any` with the type of a game result
    gameResults: any[]; // You can replace `any` with the type of a game result
    currentGameNumber: number;

    constructor(player1: Player, player2: Player, gamesCount: number, delay: number, decideFirstPlayer: (results: any[], currentGameNumber: number) => number) {
        this.players = [player1, player2];
        this.gamesCount = gamesCount;
        this.delay = delay;
        this.decideFirstPlayer = decideFirstPlayer;
        this.gameResults = [];
        this.currentGameNumber = 0;
    }

    async playAllGames() {
			console.log('Starting round...');

			for(let i = 0; i < this.gamesCount; i++) {
					this.currentGameNumber = i;

					const firstPlayerIndex = this.decideFirstPlayer(this.gameResults, this.currentGameNumber);
					const firstPlayer = this.players[firstPlayerIndex];
					const secondPlayer = this.players[(firstPlayerIndex + 1) % 2]; // The other player

					const game = new Game(firstPlayer, secondPlayer, this.delay);
					const gameResult = await game.play(); // Assuming 'play' returns game result
					this.gameResults.push(gameResult);
			}

			console.log('Round finished!');
			
			// TODO: Return the round result based on the gameResults
			// For example, you can return the player who won the most games
			// Or you can return all gameResults and decide the round winner later when all rounds are finished
	}
}

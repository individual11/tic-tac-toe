import { Player } from './player.js';
import { Round } from './round.js';
import { TournamentType } from './tournamentTypes';

export class Tournament {
    type: TournamentType;
    players: Player[];
    roundsCount: number;
    delay: number;
    decideFirstPlayer: (results: any[], currentGameNumber: number) => number; // You can replace `any` with the type of a game result
    roundResults: any[]; // You can replace `any` with the type of a round result

    constructor(type: TournamentType, players: Player[], roundsCount: number, delay: number, decideFirstPlayer: (results: any[], currentGameNumber: number) => number) {
        this.type = type;
        this.players = players;
        this.roundsCount = roundsCount;
        this.delay = delay;
        this.decideFirstPlayer = decideFirstPlayer;
        this.roundResults = [];
    }

    async start() {
			console.log('Starting tournament...');

			// TODO: You can add more sophisticated game/round creation logic depending on the tournament type.
			// Below is a basic example where each player plays every other player once (Round Robin).

			for(let i = 0; i < this.players.length; i++) {
					for(let j = i + 1; j < this.players.length; j++) {
							const round = new Round(this.players[i], this.players[j], this.roundsCount, this.delay, this.decideFirstPlayer);
							const roundResult = await round.playAllGames(); // Assuming 'playAllGames' returns round result
							this.roundResults.push(roundResult);
					}
			}

			// TODO: Implement the logic to decide the overall winner of the tournament based on the roundResults

			console.log('Tournament finished!');
	}
}

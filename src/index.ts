import inquirer from 'inquirer';
import { Player, loadPlayerFunctions } from './player';
import { Game } from './game';
import { TournamentType } from './tournamentTypes';
import { Tournament } from './tournament';

async function main() {
  const playerFunctionPaths = loadPlayerFunctions();
  // Create a Player instance for each player function
	const players = Object.entries(playerFunctionPaths).map(([name, path], i) => new Player(i.toString(), name, 'X', path)); // we update the symbol later after players are chosen


  const playerChoices = players.map((player) => {
		return {name: player.name, value: player };
	});

  const { player1 } = await inquirer.prompt<{ player1: Player }>({
    type: 'list',
    name: 'player1',
    message: 'Who is the first player?',
    choices: playerChoices
  });

  const { player2 } = await inquirer.prompt<{ player2: Player }>({
    type: 'list',
    name: 'player2',
    message: 'Who is the second player?',
    choices: playerChoices.filter(choice => choice.value !== player1)
  });

  const answers = await inquirer.prompt([
    {
      type: 'number',
      name: 'delay',
      message: 'What should be the delay between moves (in ms)?',
      default: 500,
    },
    {
      type: 'number',
      name: 'games',
      message: 'How many games should be played in a round?',
      default: 3,
    },
    {
      type: 'list',
      name: 'tournamentType',
      message: 'What type of tournament do you want to conduct?',
      choices: [
        { name: 'Round Robin - Every player plays every other player once', value: TournamentType.RoundRobin },
        { name: 'Single Elimination - Loser of each match is immediately eliminated', value: TournamentType.SingleElimination },
        // Add other types as needed
      ],
    },
  ]);

	const decideFirstPlayer = (results: any[], currentGameNumber: number) => {
		return 0;
	};

	// update the symbol
	player1.symbol = 'X';
	player2.symbol = 'O';
	// Create the tournament with the provided options and start it
	const tournament = new Tournament(answers.tournamentType, [player1, player2], answers.games, answers.delay, decideFirstPlayer);
	tournament.start();
}

main().catch(console.error);

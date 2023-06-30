/**
 * SingleElimination: A participant ceases to be eligible to win the championship upon losing a match.
 * DoubleElimination: A participant ceases to be eligible to win the championship upon losing two matches.
 * RoundRobin: Each participant competes with every other participant once.
 * Swiss: A non-elimination tournament format that features fewer rounds than a round-robin tournament.
 * League: Each participant competes with every other participant multiple times (in cycles).
 */
export enum TournamentType {
	SingleElimination,
	DoubleElimination,
	RoundRobin,
	Swiss,
	League
}

export interface IResultVote{
    title: string;
    description: string;
    numberFor: number;
    numberAgainst: number;
    numberOfVoters: number;
    suffrageExpressed: number;
    absoluteMajority: number;
}
import { IResultVote } from "./IresultVote";
import { IDataVote } from "./IDataVote";
import { Voter } from "./voter";
import { Socket } from "socket.io";

export class Vote{

    private title: string;
    private description: string;
    private Voters: Voter[];
    private endVote: boolean;
    private canJoin: boolean;
    private roomCreator: Socket;

    constructor(title: string, description: string, creator: Socket){
        this.title = title;
        this.description = description;
        this.Voters = [];
        this.endVote = false;
        this.canJoin = true;
        this.roomCreator = creator;
    }

    public getData(): IDataVote{
        return {
            title: this.title,
            description: this.description
        }
    }

    public getResult(): IResultVote{
        return {
            numberFor: this.getNumberVotersFor(),
            numberAgainst: this.getNumberVotersAgainst(),
            numberOfVoters: this.Voters.length,
            suffrageExpressed: this.getSuffrageExpressed(),
            absoluteMajority: this.getAbsoluteMajority()
        }
    }

    public addVoters(socket: Socket){
        if(!this.endVote && this.canJoin){
            this.Voters.push(new Voter(socket,this));
        }
    }

    public stopJoining(applicant: Socket){
        if(this.roomCreator === applicant)
            this.canJoin = false;
    }

    public stopVote(applicant: Socket){
        if(this.roomCreator === applicant)
            this.endVote = true;
    }

    private getNumberVotersFor(){
        return this.Voters.reduce((acc: number, value: Voter) => {
            if(value.getFor()) 
                return acc++;
            return acc;
        }, 0)
    }

    private getNumberVotersAgainst(){
        return this.Voters.reduce((acc: number, value: Voter) => {
            if(value.getAgainst()) 
                return acc++;
            return acc;
        }, 0)
    }

    private getSuffrageExpressed(): number{
        return this.Voters.reduce((acc: number, value: Voter) => {
            if(value.getVoted()) 
                return acc++;
            return acc;
        }, 0)
    }

    private getAbsoluteMajority(): number{
        if(this.Voters.length%2 === 0){
            return (this.Voters.length/2)+1
        } else {
            return Number.parseInt((this.Voters.length/2).toFixed(0));
        }
        
    }

}
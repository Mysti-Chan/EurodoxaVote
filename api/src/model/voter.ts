import {Socket} from "socket.io";
import { Vote } from "./vote";

export class Voter{
    private socket: Socket;
    private voted: boolean;
    private for: boolean;
    private against: boolean;
    private vote: Vote;

    constructor(socket: Socket, vote: Vote){
        this.socket = socket;
        this.voted = false;
        this.for = false;
        this.against = false;
        this.vote = vote;

        //spprime tout les evenement pour mettre celui du dernier vote inscrit
        this.socket.removeAllListeners("vote");
        this.socket.send("vote", this.vote.getData());
        this.socket.on("vote", (data) => {
            this.resultVote(data.vote);
        })

    }

    public resultVote(data: boolean){
        if(data){
            this.for = true;
            this.against = false;
        } else {
            this.for = false;
            this.against = true;
        }
    }

    public getFor(): boolean{
        return this.for;
    }

    public getAgainst(): boolean{
        return this.against;
    }

    public getVoted(): boolean{
        return this.voted;
    }
}
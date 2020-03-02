import { Vote } from "./vote";
import { Socket } from "socket.io";
import { IDataVote } from "./IDataVote";
import * as shortid from 'shortid';

export class Room{

    private id: string;
    private name: string;
    private votes: Vote[];
    private voteInProgress: Vote;
    private participants: Socket[];
    private creator: Socket;

    constructor(name: string){
        this.id = shortid.generate();
        this.name = name;
        this.votes = [];
        this.voteInProgress = null;
        this.creator = null;
        this.participants = [];
    }

    public createVote(title: string, description: string, socket: Socket){
        if(!this.voteInProgress){
            if(socket === this.creator){
                let vote = new Vote(title, description);
                this.votes.push(vote);
                this.voteInProgress = vote;
                
                this.participants.forEach(el => {
                    this.voteInProgress.addVoters(el);
                });
        
                this.voteInProgress.stopJoining();
                socket.emit("voteCreated");
            }
        } else{
            socket.emit("voteAlreadyInProgress");
        }

    }

    public join(socket: Socket){
        if(this.creator == null){
            this.creator = socket;
        }

        this.participants.push(socket);
        if(this.voteInProgress != null)
            socket.emit("voteInProgress");
    }

    public left(socket: Socket){
        this.participants.filter((el) => {
            if(el !== socket)
                return true;
        });
        socket.emit("roomLeft");
    }

    public stopVoteInProgress(socket: Socket){
        if(this.creator === socket){
            this.voteInProgress.stopVote;
            this.voteInProgress = null;
            this.creator.emit("voteResult", this.voteInProgress.getResult());
        }
    }

    public getDataVoteInProgress(): IDataVote{
        if(this.voteInProgress)
            return this.voteInProgress.getData();
        return null;
    }

    public deleteRoom(){
        this.participants.forEach((socket) => {
            socket.emit("roomNotExist");
        });
        
        this.participants = [];
        this.votes = [];
        this.voteInProgress = null;
        this.creator.emit("roomDeleted");
    }

    public isVoteInProgress(): boolean{
        return this.voteInProgress !== null;
    }
    
    public isCreator(socket: Socket): boolean{
        return this.creator === socket;
    }

    public getName(): string{
        return this.name;
    }

    public getId(): string{
        return this.id;
    }
}
import { Vote } from "./vote";
import { Socket } from "socket.io";

export class Room{

    private votes: Vote[];
    private voteInProgress: Vote;
    private participants: Socket[];
    private roomCreator: Socket;

    constructor(creator: Socket){
        this.votes = [];
        this.voteInProgress = null;
        this.roomCreator = creator;
        this.participants = [];
    }

    public createVote(title: string, description: string){
        let vote = new Vote(title, description);
        this.votes.push(vote);
        this.voteInProgress = vote;
        
        this.participants.forEach(el => {
            this.voteInProgress.addVoters(el);
        });

        this.voteInProgress.stopJoining();
    }

    public join(socket: Socket){
        this.participants.push(socket);
        if(this.voteInProgress != null)
            socket.emit("voteInProgress", {});
    }

    public left(socket: Socket){
        this.participants.filter((el) => {
            if(el !== socket)
                return true;
        });
    }

    public stopVoteInProgress(socket: Socket){
        if(this.roomCreator === socket){
            this.voteInProgress.stopVote;
            this.roomCreator.emit("voteResult", this.voteInProgress.getResult());
        }
    }

    public deleteRoom(){
        this.participants.forEach((socket) => {
            socket.emit("roomDeleted");
        });
        this.participants = [];
        this.votes = [];
        this.voteInProgress = null;
    }
}
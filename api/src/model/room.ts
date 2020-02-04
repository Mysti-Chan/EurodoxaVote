import { Vote } from "./vote";
import { Socket } from "socket.io";
import { IDataVote } from "./IDataVote";

export class Room{

    private static InstanceRoom: Room;
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

    public createVote(title: string, description: string, socket: Socket){
        console.log(!this.voteInProgress);
        console.log(socket === this.roomCreator);
        if(!this.voteInProgress){
            if(socket === this.roomCreator){
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
        if(this.roomCreator === socket){
            this.voteInProgress.stopVote;
            this.voteInProgress = null;
            this.roomCreator.emit("voteResult", this.voteInProgress.getResult());
        }
    }

    public getDataVoteInProgress(): IDataVote{
        if(this.voteInProgress)
            return this.voteInProgress.getData();
        return null;
    }

    public deleteRoom(){
        this.participants.forEach((socket) => {
            socket.emit("roomDeleted");
        });
        this.participants = [];
        this.votes = [];
        this.voteInProgress = null;
        this.roomCreator.emit("roomDeleted");
    }

    public isCreator(socket: Socket): boolean{
        return this.roomCreator === socket;
    }

    public static getInstance(socket: Socket): Room{
        if(!this.InstanceRoom){
            this.InstanceRoom = new Room(socket);
        }
        return this.InstanceRoom;
    }

    public static existInstance(): boolean{
        if(this.InstanceRoom)
            return true;
        return false;
    }
}
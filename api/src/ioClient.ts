import {Socket} from "socket.io";
import { Room } from "./model/room";

export class IoClient{

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;

        if(Room.existInstance()){
            socket.emit("roomExist");
        } else {
            socket.emit("roomNotExist");
        }

        socket.on("voteInformation", () =>{
            if(Room.existInstance()){
                let room = Room.getInstance(socket);
                socket.emit("voteInformation",room.getDataVoteInProgress());
            }
        })

        socket.on("createRoom", (data, fn) =>{
            console.log("paf")
            Room.DeleteInstance();
            Room.getInstance(socket);
            fn();
        });

        socket.on("createVote", (data, fn) =>{
            if(Room.existInstance()){
                let room = Room.getInstance(socket);
                room.createVote(data.title, data.description, socket);
            } else {
                socket.emit("noRoom");
            }
        });
    }
}
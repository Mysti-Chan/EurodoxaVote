import {Socket} from "socket.io";
import { Room } from "./model/room";

export class IoClient{

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;

        socket.on("joinRoom", () =>{
            if(Room.existInstance()){
                let room = Room.getInstance(socket);
                socket.emit("roomJoined", room.getDataVoteInProgress());
            } else {
                socket.emit("noRoom");
            }
        });

        socket.on("createRoom", () =>{
            if(Room.existInstance()){
                socket.emit("RoomAlreadyExist");
            } else {
                let room = Room.getInstance(socket);
                socket.emit("roomCreated");
            }
        });

        socket.on("createVote", () =>{
            if(Room.existInstance()){
                let room = Room.getInstance(socket);
                room.createVote("je suis un titre", "je suis une description", socket);
            } else {
                socket.emit("noRoom");
            }
        });
    }
}
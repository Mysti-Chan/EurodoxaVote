import {Socket} from "socket.io";
import { Room } from "./model/room";

export class IoClient{

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;

        socket.on("joinRoom", () =>{
            if(Room.existInstance())
                socket.emit("RoomJoined", "oui");
            socket.emit("noRoom","non");
        });
    }
}
import {Socket} from "socket.io";
import { Room } from "./model/room";
import { Server } from "./server";
import * as jwt from "jsonwebtoken"

export class IoClient{

    private socket: Socket;
    private server: Server;
    private admin: boolean;

    constructor(socket: Socket, server: Server){
        this.socket = socket;
        this.server = server;

        this.socket.on("authenticate", (data) => {
            try{
                jwt.verify(data.token, "JeSuisUnSecret");
                this.admin = true;
                this.setRoute();
            } catch {
                this.setAdminRoute();
            }

        });

    }

    private setRoute(){
        this.socket.on("roomList", (data, fn) => {
            fn(this.server.getRooms());
        });

        this.socket.on("joinRoom", (data, fn) =>{
            let room = this.server.getRoom(data.id);
            if(room){
                room.join(this.socket);
                fn(true)
                return;
            }
            fn(false);
        });
    }


    private setAdminRoute(){
    }
}
import {Socket} from "socket.io";

export class IoClient{

    private socket: Socket;
    private voted: boolean;

    constructor(socket: Socket){
        this.socket = socket;
        this.voted = false;

        this.socket.on("vote", () => {
            if(!this.voted){
                this.voted = true;
            }
        });
    }
}
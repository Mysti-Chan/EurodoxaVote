import {Socket} from "socket.io";

export class IoClient{

    private socket: Socket;

    constructor(socket: Socket){
        this.socket = socket;
    }
}
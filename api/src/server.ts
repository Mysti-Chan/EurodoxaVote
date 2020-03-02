import * as express from "express";
import * as bodyParser from "body-parser";
import * as glob from "glob";
import * as path from "path";
import * as mongodb from "mongodb";
import Passport from "./passport";
import * as Http from "http"
import * as SocketIo from "socket.io";
import { IoClient } from "./IoClient";
import { Room } from "./model/room";
import { createConnection, Connection } from 'typeorm';

export class Server{

    private host: string;
    private port: number;
    private app: any;
	private rooms: Room[];
	private httpServer: Http.Server;
	private sockerServer: SocketIo.Server;
    private ioClients: IoClient[];

    constructor(host: string, port: number, dataBaseConfig: any){
        this.rooms = [];
        this.ioClients = [];
        this.host = host;
        this.port = port;
        this.app = express();

        this.app.use(bodyParser.json({
            limit: '50mb',
        }));

        this.setRoute();
        Passport.configure(this.app);
        this.setDataBase(dataBaseConfig);
		
		this.httpServer = new Http.Server(this.app)
        this.sockerServer = SocketIo(this.httpServer);

        this.sockerServer.on("connection", (socket: SocketIo.Socket) =>{
            console.log("client connected")
            this.ioClients.push(new IoClient(socket));
        });

    }

    private setRoute(){
        glob.sync('./routes/*.routes.*s').forEach(route => {
            require(path.resolve(route))(this.app);
        });
    }

    private setDataBase(dataBaseConfig: any){
        createConnection(dataBaseConfig).then((connection: Connection) => {
            this.app.use(bodyParser.json({
                limit: '50mb'
            }));
        });
    }

    start(){	
		this.httpServer.listen(3011, () =>{
            console.log(`Socketio listening on 3011`);
        })
		
        this.app.listen(this.port, () => {
            console.log(`Server started on port ${this.host}:${this.port}.`)
        });
    }
	
	public getRooms(): Room[]{
        return this.rooms;
    }

    public addRoom(room: Room){
        this.rooms.push(room);
    }

    public deleteRoom(id: string){
        this.rooms = this.rooms.filter((el) => {
            if(el.getId() === id){
                el.deleteRoom()
                return false;
            }
            return true;
        })
    }

}

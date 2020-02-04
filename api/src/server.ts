import * as Express from "express";
import * as Glob from "glob";
import * as Path from "path";
import * as Http from "http"
import * as SocketIo from "socket.io";
import { IoClient } from "./IoClient";

export class Server{

    private host: string;
    private port: number;
    private app: Express.Application;
    private httpServer: Http.Server;
    private sockerServer: SocketIo.Server;
    private ioClients: IoClient[];

    constructor(host: string, port: number){
        this.host = host;
        this.port = port;
        this.app = Express();
        this.ioClients = [];

        this.httpServer = new Http.Server(this.app)
        this.sockerServer = SocketIo(this.httpServer);

        this.sockerServer.on("connection", (socket: SocketIo.Socket) =>{
            this.ioClients.push(new IoClient(socket));
        });

        this.setRoutes();
    }

    private setRoutes(){
        Glob.sync('./src/routes/*.routes.*s').forEach(route => {
            require(Path.resolve(route))(this.app);
        });
    }

    public start(){
        this.app.listen(this.port, this.host, ()=>{
            console.log(`Server listening on ${this.port}`);
        });
    }

}
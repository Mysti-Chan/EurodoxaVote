import {Application, Request, Response} from "express";
import { Server } from "../server";
import { Room } from "../model/room";

module.exports = (server: Server) => {

    server.getApp().route("room")

    .get((req: Request, res: Response) =>{
        res.json(server.getRooms());
    })

    /**
     * body:
     * name
     */
    .post((req: Request, res: Response) =>{
        let roomName = req.body.name;
        let room = new Room(roomName);

        server.addRoom(room);

        res.json({
            name : room.getName(),
            id: room.getId()
        });
    })

    /**
     * param:
     * id
     */
    .delete((req: Request, res: Response) =>{
        let id = req.params.id;
        server.deleteRoom(id);
    })
}
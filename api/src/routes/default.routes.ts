import {Application, Request, Response} from "express";

module.exports = (app: Application) => {

    app.get("/",(req: Request, res: Response) =>{
        res.send("i'm alive");
    });

}
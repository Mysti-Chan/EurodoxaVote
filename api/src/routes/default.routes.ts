import { Application } from "express-serve-static-core";
import {Request, Response} from "express";
import { UserMiddleware } from "../middleware/users.middleware";

module.exports = function(app: Application){
    
    app.get("/",(req: Request, res: Response, next: any) => {
        res.status(200).send("ok");
        next();
    });

}
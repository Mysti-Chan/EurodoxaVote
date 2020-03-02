import Passport from "../passport";

import { Application } from "express-serve-static-core";
import {Request, Response} from "express";
import { UserMiddleware } from "../middleware/users.middleware";
import { User } from "../model/user.model";
import { UserEntity } from "../entity/user.entity";
module.exports = function(app: Application){
    
    app.route("/user")
    .get(
        Passport.checkJwtToken,
        UserMiddleware.getList
    )
    .post(
        UserMiddleware.canCreateByMail,
        UserMiddleware.canCreateByUsername,
        UserMiddleware.save,
    )
    .put(
        Passport.checkJwtToken,
        UserMiddleware.update
    )
    .delete(
        Passport.checkJwtToken,
        UserMiddleware.delete
    );

    app.route("/user/me")
    .get(
        Passport.checkJwtToken,
        UserMiddleware.getMe
    );

    app.route('/user/signin')
    .post(
        UserMiddleware.canConnectUser,
        (req: Request, res: Response, next: any) => {

            const payload = {_id: res.locals.user._id}
            res.setHeader('Access-Control-Expose-Headers', "Authorization");
            res.setHeader('Authorization', 'Bearer ' + Passport.signToken(payload));

            let user: UserEntity = res.locals.user;
            return res.json(new User(user));
        }
    )
}
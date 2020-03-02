const config = require("./config/config");

import * as passport from 'passport';
import * as jwt from 'jsonwebtoken'

import { Application,Request, Response } from "express";
import { ExtractJwt, StrategyOptions, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy, IStrategyOptionsWithRequest } from 'passport-local';
import { getMongoManager } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

export default class Passport{

    public static configure(app: Application) {
        app.use(passport.initialize());

        //jwt option
        const jwtOptions: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwt').secret,
            ignoreExpiration: false
        };

        //jwt strategy
        passport.use('jwt', new JwtStrategy(jwtOptions, (jwt_payload, done) => {
            getMongoManager().findOne(UserEntity, {_id: jwt_payload._id}).then(user =>{
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }

    public static checkJwtToken(req: Request, res: Response, next: any) {

        return passport.authenticate('jwt', { session: false, failWithError:true, }, function(err, user, jwtPayload) {
            if (jwtPayload && jwtPayload instanceof Error) {
                let err = jwtPayload;
        
                let status = 401;
                let code = 40101;
                let title = 'Access refused'
                let detail = 'No auth token'
        
                if (err instanceof TokenExpiredError) {
                    code = 40103;
                    detail = 'Token expired';
                } else if (err instanceof JsonWebTokenError) {
                    code = 40102;
                    detail = 'Token invalid';
                } else if (err instanceof Error){
                    code = 40101;
                    detail = 'No auth token';
                }

                return res.status(401).json({status, code, title, detail,});
            }

            
            if(!req.headers.authorization)
                return res.status(503).json({title: "unknown error"});

            let token = req.headers.authorization.replace("Bearer ","");
            let decoded: any = jwt.decode(token, {complete: true});

            let looking = (new UserEntity())._id = decoded.payload._id;
            getMongoManager().findOne(UserEntity, looking).then(
                user => {
                    if(!user){
                        let status = 401;
                        let code = 40101;
                        let title = 'Access refused'
                        let detail = 'No auth token'
                        return res.status(401)
                        .json({status, code, title, detail,});
                    }
                    
                    res.locals.user = user;
                    res.locals.payload = jwtPayload;
                    next();
                }
            );
        })(req,res)
    }

    public static signToken(payload: any) {
        return jwt.sign(payload, config.get('jwt').secret, { expiresIn: config.get('jwt').expires_in });
    }
}
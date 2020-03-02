import {ObjectID} from "mongodb";
import { UserEntity } from "../entity/user.entity";

export class User {

    _id:ObjectID;

    username:string | undefined;

    constructor(user: UserEntity){
        this._id = user._id;
        this.username = user.username;
    }
}

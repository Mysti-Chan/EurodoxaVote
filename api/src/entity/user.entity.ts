import {
    Column,
    Entity,
    ObjectIdColumn,
    getMongoManager
} from "typeorm";

import {ObjectID} from "mongodb";

@Entity("Users")
export class UserEntity {

    @ObjectIdColumn()
    _id:ObjectID;

    @Column()
    username:string | undefined;

    @Column()
    password: string | undefined;
    
    constructor(id: any = undefined){
        this._id = new ObjectID(id);
    }
}

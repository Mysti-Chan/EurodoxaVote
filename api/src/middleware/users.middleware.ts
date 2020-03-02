import { Request, Response } from "express";
import { getMongoManager } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { User } from "../model/user.model";
import { ObjectID } from "mongodb"

/**
 * Rappel des erreurs HTTP les plus importantes:
 * ---------------------------------------------
 * 
 * 200 : succès de la requête ;
 * 301 et 302 : redirection, respectivement permanente et temporaire ;
 * 401 : utilisateur non authentifié ;
 * 403 : accès refusé ;
 * 404 : page non trouvée ;
 * 409 : conflit;
 * 500 et 503 : erreur serveur ;
 * 504 : le serveur n'a pas répondu.
 * 
 * source : wikipedia
 */

export class UserMiddleware{

    /**
     * Sauvegarde un utilisateur.
     * La requête doit contenir l'utilisateur à sauvegarder.
     */
    public static save(req: Request, res: Response, next: any){
        const user: UserEntity = Object.assign(new UserEntity(), req.body);
        //let data = new UserEntity();
        //data.email = "user";
        //data.password = "password";
        //data.username = "user";
        //data.created_at = "date";

        getMongoManager().save(user)
        .then(user => {
            if(user)
                return res.status(200).send();

            return res.status(500).json({
                code: 500,
                title: "user cannot be save"
            })
        });
    }

    /**
     * Récupère un utilisateur.
     * La requête doit contenir l'id de la personne.
     */
    public static get(req: Request, res: Response, next: any){
        const id = req.params.id;
        const user = new UserEntity(id);

        getMongoManager().findOne(UserEntity, user)
        .then(user => {
            if (user) {
                return res.status(200).json(new User(user));
            }

            return res.status(404).json({
                code: 404,
                title: `No user found with id (${id})`
            });
        });




    }

    /**
     * Récupère l'ensemble des utilisteurs.
     */
    public static getList(req: Request, res: Response, next: any) {
        getMongoManager().find(UserEntity)
        .then(result => {
            let users = result.map((user: UserEntity) => new User(user));
            return res.status(200).json(users);
        });
    }

    /**
     * Mets à jour un utilisteur
     * La requête doit l'objet de la personne à modifier
     */
    public static update(req: Request, res: Response, next: any) {
        let {_id,...data} = req.body
        const userUpdate: UserEntity = Object.assign(new UserEntity(_id), data);

        getMongoManager()
        .update(UserEntity, {_id: userUpdate._id} , userUpdate)
            .then(user => {
                return res.status(200).json(new User(userUpdate));
            });
    }

    /**
     * Supprime un utilisteur
     * La requête doit contenir l'id de la personne.
     */
    public static delete(req: Request, res: Response, next: any) {
        let filter = {_id: new ObjectID(req.body._id)}

        getMongoManager().findOneAndDelete(UserEntity, filter)
        .then((user) => {
            if(user.value){
                return res.status(200).json();
            }
            
            res.status(404).json({title:"User not found"});
        })
    }

    /**
     * Recupere l'utilisateur qui fait faire la demande
     */
    public static getMe(req: Request, res: Response, next: any){
        res.status(200).json(new User(res.locals.user));
    }

    /**
     * Regarde si il est possible de créer l'utilisateur 
     * dans la base de donnée en fonction de son nom d'utilisateur
     */
    public static canCreateByUsername(req: Request, res: Response, next: any) {
        const username = req.body.username

        getMongoManager().findOne(UserEntity, {username})
            .then(user => {
                if (user) {
                    return res.status(409).json({
                        title: "this username already exists"
                    });
                }
                next()
            })
    }

    /**
     * Verifie si un utilisateur peut se connecter
     */
    public static canConnectUser(req: Request, res: Response, next: any){
        const userFilter: any = {};
        userFilter.username = req.body.username;
        userFilter.password = req.body.password;

        getMongoManager().findOne(UserEntity, userFilter)
            .then(user => {
                if (!user) {
                    return res.status(403).json({
                        title: "Username or password is incorrect"
                    });
                }
                res.locals.user = user;
                next();
            })
    }
}
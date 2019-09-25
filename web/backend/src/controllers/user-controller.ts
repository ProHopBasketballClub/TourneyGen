// eslint-disable-next-line no-unused-vars
import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
// eslint-disable-next-line no-unused-vars
import {User} from "../models";

import {MongoDb} from '../db/mongo.db';

/**
 * Controller defining the CRUD methods for user
 *
 * @export
 */
export class UserController {
    private table: string = 'user';

    public async get(req: Request, res: Response) {
        if (req.query.id !== undefined) {
            if (req.query.id.length > 1) {
                const out = await MongoDb.getById(this.table, req.query.id);
                res.json(out);
                res.statusCode = HttpStatus.OK;
                return;
            }
        } else if (req.query.displayName !== undefined && req.query.displayName.length > 0) {
            const out = await MongoDb.getByDisplayName(this.table, req.query.displayName);
            res.json(out);
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            const out = await MongoDb.getAll(this.table);
            res.json(out);
            res.statusCode = HttpStatus.OK;
            return;
        }
    }

    //post creates new objects
    public async post(req: Request, res: Response) {
        const user: User = req.body;
        if (!User.validUser(user)) {
            res.json({error: 'The request body is invalid'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.getByDisplayName(this.table, user.displayName) !== null) {
            res.json({error: "A user already has this user name please choose a different one"});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.save(this.table, user)) {
            res.json(user);
            res.statusCode = HttpStatus.OK;
            return;
        }
    }

    //put updates an existing object
    public async put(req: Request, res: Response) {
        const user: User = req.body;
        if (!User.validUser(user) || req.query.id === undefined) {
            res.json({error: 'The request body is invalid'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.getById(this.table, req.query.id) === null) {
            res.json({error: "You cannot update a user that does not exist"});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.updateById(this.table, user, req.query.id)) {
            user._id = req.query.id;
            res.json(user);
            res.statusCode = HttpStatus.OK;
            return;
        } else{
            res.json({error: 'Internal Server Error update failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

    //deletes a user by id in the params
    public async delete(req: Request, res: Response) {
        if (req.query.id === undefined) {
            res.json({error: 'id must be specified as a param of this request'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.getById(this.table, req.query.id) === null) {
            res.json({error: "You cannot update a user that does not exist"});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.deleteById(this.table, req.query.id)) {
            res.json({Msg: 'Successfully Deleted User with id' + req.query.id});
            res.statusCode = HttpStatus.OK
        } else {
            res.json({error: 'Internal Server Error delete failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}

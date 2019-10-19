import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db/mongo.db';
import {DataReturnDTO, User} from '../models';
import {IController} from "./controller.interface";

/**
 * Controller defining the CRUD methods for user
 *
 * @export
 */
export class UserController implements IController {
    private table: string = 'user';

    public async get(req: Request, res: Response) {
        if (req.query.id) {
            if (req.query.id.length === MongoDb.MONGO_ID_LEN) {
                const out: DataReturnDTO = await MongoDb.getById(this.table, req.query.id);
                if (out.valid) {
                    res.json(out.data);
                    res.statusCode = HttpStatus.OK;
                    return;
                } else {
                    res.json({error: out.data});
                    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                }

            } else {
                res.json({error: 'The id specified is malformed'});
                res.statusCode = HttpStatus.BAD_REQUEST;
                return;
            }
        } else if (req.query.displayName) {
            if (req.query.displayName.length >= User.MIN_DISPLAYNAME_LEN) {
                const out = await MongoDb.getByDisplayName(this.table, req.query.displayName);
                if (out.valid) {
                    res.json(out.data);
                    res.statusCode = HttpStatus.OK;
                    return;
                } else {
                    res.json(out.data);
                    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    return;
                }
            } else {
                res.json({error: 'The displayName must be at least 4 characters'});
                res.statusCode = HttpStatus.BAD_REQUEST;
            }
        } else {
            res.json({error: 'Invalid request id or displayName required'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
    }

    // post creates new objects
    public async post(req: Request, res: Response) {
        const user: User = req.body;
        if (!User.validUser(user)) {
            res.json({error: 'Display name must be at least ' + User.MIN_DISPLAYNAME_LEN + ' long'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if ((await MongoDb.getByDisplayName(this.table, user.displayName)).data !== null) {
            res.json({error: 'A user already has this user name please choose a different one'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.save(this.table, user)) {
            res.json(user);
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json({error: 'Internal Server Error creation failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
    }

    // put updates an existing object
    public async put(req: Request, res: Response) {
        const user: User = req.body;
        if (!User.validUser(user) || !req.query.id) {
            res.json({error: 'Display name must be at least ' + User.MIN_DISPLAYNAME_LEN + ' long and an id must be a param'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.json({error: 'You cannot update a user that does not exist'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.updateById(this.table, req.query.id, user)) {
            user._id = req.query.id;
            res.json(user);
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json({error: 'Internal Server Error update failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }

    }

    public async getAll(req: Request, res: Response) {
        const out = await MongoDb.getAll(this.table);
        if (out.valid) {
            res.json(out.data);
            res.statusCode = HttpStatus.OK;
        } else {
            res.json(out.data);
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }

    }

    // deletes a user by id in the params
    public async delete(req: Request, res: Response) {
        if (!req.query.id) {
            res.json({error: 'Id must be specified as a param of this request'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.json({error: 'You cannot update a user that does not exist'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.deleteById(this.table, req.query.id)) {
            res.json({Msg: 'Successfully Deleted User with id ' + req.query.id});
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json({error: 'Internal Server Error delete failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
    }
}

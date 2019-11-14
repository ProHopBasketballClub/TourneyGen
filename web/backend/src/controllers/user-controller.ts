import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db/mongo.db';
import {DataReturnDTO, User} from '../models';
import {IController} from './controller.interface';

/**
 * Controller defining the CRUD methods for user
 *
 * @export
 */
export class UserController implements IController {
    public static table: string = 'user';

    public async get(req: Request, res: Response) {
        if (req.query.id) {
            if (req.query.id.length === MongoDb.MONGO_ID_LEN) {
                const out: DataReturnDTO = await MongoDb.getById(UserController.table, req.query.id);
                if (out.valid) {
                    if (!out.data) {
                        res.statusCode = HttpStatus.NOT_FOUND;
                        res.json({error: 'No user was found with id ' + req.query.id});
                        return;
                    } else {
                        res.statusCode = HttpStatus.OK;
                        res.json(out.data);
                        return;
                    }
                } else {
                    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    res.json({error: out.data});
                    return;
                }

            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The id specified is malformed'});
                return;
            }
        } else if (req.query.displayName) {
            if (req.query.displayName.length >= User.MIN_DISPLAYNAME_LEN) {
                const out: DataReturnDTO = await MongoDb.getByDisplayName(UserController.table, req.query.displayName);
                if (out.valid) {
                    if (!out.data) {
                        res.statusCode = HttpStatus.NOT_FOUND;
                        res.json({error: 'No user was found with Display Name ' + req.query.displayName});
                        return;
                    } else {
                        res.statusCode = HttpStatus.OK;
                        res.json(out.data);
                        return;
                    }
                } else {
                    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    res.json(out.data);
                    return;
                }
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The displayName must be at least 4 characters'});
                return;
            }
        } else if (req.query.email) {
            if (req.query.email.length >= 1) {
                const out: DataReturnDTO = await MongoDb.getByEmail(UserController.table, req.query.email);
                if (out.valid) {
                    if (!out.data) {
                        res.statusCode = HttpStatus.NOT_FOUND;
                        res.json({error: 'No user was found with email ' + req.query.email});
                        return;
                    } else {
                        res.statusCode = HttpStatus.OK;
                        res.json(out.data);
                        return;
                    }
                } else {
                    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    res.json(out.data);
                    return;
                }
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'An email must be provided with this request.'});
                return;
            }
        } else {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Invalid request id or displayName required'});
            return;
        }
    }

    // post creates new objects
    public async post(req: Request, res: Response) {
        const user: User = req.body;
        if (!User.validUser(user)) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Display name must be at least ' + User.MIN_DISPLAYNAME_LEN + ' long'});
            return;
        }
        if ((await MongoDb.getByDisplayName(UserController.table, user.displayName)).data !== null) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'A user already has this username, please choose a different one'});
            return;
        }
        if (await MongoDb.save(UserController.table, user)) {
            res.statusCode = HttpStatus.OK;
            res.json(user);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error creation failed'});
            return;
        }
    }

    // put updates an existing object
    public async put(req: Request, res: Response) {
        if (!User.validUser(req.body) || !req.query.id) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Display name must be at least ' + User.MIN_DISPLAYNAME_LEN + ' long and an id must be a param'});
            return;
        }
        if (req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The id parameter is malformed'});
            return;
        }
        if ((await MongoDb.getById(UserController.table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot update a user that does not exist'});
            return;
        }
        if (await MongoDb.updateById(UserController.table, req.query.id, req.body)) {
            res.statusCode = HttpStatus.OK;
            res.json((await MongoDb.getById(UserController.table, req.query.id)).data);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error update failed'});
            return;
        }

    }

    public async getAll(req: Request, res: Response) {
        const out: DataReturnDTO = await MongoDb.getAll(UserController.table);
        if (out.valid) {
            res.statusCode = HttpStatus.OK;
            res.json(out.data);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json(out.data);
            return;
        }

    }

    // deletes a user by id in the params
    public async delete(req: Request, res: Response) {
        if (!req.query.id) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Id must be specified as a param of this request'});
            return;
        }
        if (!(await MongoDb.getById(UserController.table, req.query.id)).data) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot update a user that does not exist'});
            return;
        }
        if (await MongoDb.deleteById(UserController.table, req.query.id)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'Successfully Deleted User with id ' + req.query.id});
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error delete failed'});
            return;
        }
    }
}

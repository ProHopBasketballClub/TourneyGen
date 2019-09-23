import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {User} from "../models";

import {MongoDb} from '../db/mongo.db';

/**
 * Controller defining the CRUD methods for to do
 *
 * @export
 */
export class UserController {
    private table: string = 'user';
    private emailEx: RegExp = /[\w\d]+@\w+\.\w{2,3}/g;

    public async get(req: Request, res: Response) {
        console.log(req.query.id);
        if (req.query.id !== undefined) {
            if (req.query.id.length < 1) {
                const out = await MongoDb.getAll(this.table);
                res.json(out);
                res.statusCode = HttpStatus.OK;
                return;
            } else if (req.query.id.length > 1) {
                const out = await MongoDb.getById(this.table, req.query.id);
                res.json(out);
                res.statusCode = HttpStatus.OK;
                return;
            }
        } else if (req.query.displayName !== undefined && req.query.displayName.length > 0) {
            const out = await MongoDb.getByDisplayname('user', req.query.displayName);
            res.json(out);
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            const out = await MongoDb.getAll('user');
            res.json(out);
            res.statusCode = HttpStatus.OK;
            return;
        }
    }

    //post creates new objects
    public async post(req: Request, res: Response) {
        console.log('post');
        const user: User = req.body;
        console.log(user);
        if (!this.validUser(user)) {
            res.json({error: 'The request body is invalid'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        await MongoDb.save('user', user);
        res.json(user);
        res.statusCode = HttpStatus.OK;
    }

    public async put(req: Request, res: Response) {
        const user: User = req.body;
        if (!this.validUser(user) || req.query.id === undefined) {
            res.json({error: 'The request body is invalid'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        await MongoDb.updateById(this.table,user,req.query.id);
        user._id = req.query.id;
        res.json(user);
        res.statusCode = HttpStatus.OK;
        return ;
    }


    private validUser(user: User): boolean {
        if (user.displayName == null || user.displayName.length < 4) {
            return false;
        }

        return this.emailEx.test(user.email);
    }

    public async delete(req: Request, res: Response) {

    }
}
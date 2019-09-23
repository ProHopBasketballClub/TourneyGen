import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import {MongoDb} from '../db/mongo.db';

/**
 * Controller defining the CRUD methods for to do
 *
 * @export
 */
export class UserController {
    private table: String = 'todo';

    public async get(req: Request, res: Response) {
        if (req.params.id == '-1') {
            res.json(MongoDb.getAll(this.table));
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json(MongoDb.getOne(this.table, req.params.id));
            res.statusCode = HttpStatus.OK;
            return;
        }
    }

    //post creates new objects
    public async post(req: Request, res: Response) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const document = {name: "Ethan", title: "About MongoDB"};
        await MongoDb.save('todo',document);
        var out = MongoDb.getAll('todo');
        res.json(out)
        res.statusCode = HttpStatus.OK;
    }
}
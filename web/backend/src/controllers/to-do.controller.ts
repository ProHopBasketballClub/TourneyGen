import { Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';

import { MongoDb } from '../db/mongo.db';

/**
 * Controller defining the CRUD methods for to do
 *
 * @export
 */
export class ToDoController  {

    /**
     * deletes a single todo
     *
     */
    public delete(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }

    /**
     * gets a a list of todos
     *
     */
    public async get(req: Request, res: Response) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        var collection = db.collection('todo');
        var document = {name:"David", title:"About MongoDB"};
        collection.insert(document);
        db.collection('todo', (error, collection) => {
            if (error) {
                res.json(error);
                res.statusCode = HttpStatus.BAD_REQUEST;

                return;
            }

            collection
                .find()
                .toArray((arrayError, result) => {
                    if (arrayError) {
                        res.json(arrayError);
                        res.statusCode = HttpStatus.BAD_REQUEST;
                    }

                    res.json(result);
                    res.statusCode = HttpStatus.OK;
                });
        });

        mongo.close();
    }

    /**
     * posts a single todo
     *
     */
    public async post(req: Request, res: Response) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();

        if (db) {
            db
                .collection('todo')
                .insertOne(req.body, (err, result) => {
                    if (err) {
                        res.json(err);
                        res.statusCode = HttpStatus.BAD_REQUEST;
                    }

                    res.json(result);
                    res.statusCode = HttpStatus.OK;
                });
        } else {
            res.json({'msg': 'could not connect to db'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    /**
     * updates a single todo
     *
     */
    public put(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
}
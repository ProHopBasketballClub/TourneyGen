import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';

export class RequestValidation {
    public static async RecordExistsWithBody(req, res, table): Promise<boolean> {
        if (Object.keys(req.body).length < 1) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'This request requires a body'});
            return false;
        }
        if (!req.query.id || req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The id in this request is not valid'});
            return false;
        }
        if ((await MongoDb.getById(table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot update a match that does not exist'});
            return false;
        }
        return true;
    }

    public static async RecordExists(req, res, table): Promise<boolean> {
        if (!req.query.id || req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The id in this request is not valid'});
            return false;
        }
        if ((await MongoDb.getById(table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot update a match that does not exist'});
            return false;
        }
        return true;
    }

    public static async ValidScoreBody(res, req, table): Promise<boolean> {
        if (!await RequestValidation.RecordExists(req, res, table)) {
            return false;
        }
        if (!req.body.Away_Score || !req.body.Home_Score) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The request must contain a home and away score'});
            return false;
        }
        if (isNaN(req.body.Away_Score) || isNaN(req.body.Home_Score)) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The scores must be numeric'});
            return false;
        }
        return true;
    }
}

import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';
import {DataReturnDTO, Team} from '../models';
import {Match} from '../models/match';
import {MatchController} from './match-controller';

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
            res.json({error: 'You cannot update a object that does not exist'});
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

    public static async validMatchReport(req: Request, res: Response): Promise<boolean> {
        if (!req.body.Home_Score || !req.body.Away_Score) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Both the home score and away score must be included in the body of this request'});
            return false;
        }
        if (isNaN(req.body.Home_Score) || isNaN(req.body.Away_Score)) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The Scores must be numeric'});
            return;
        }
        if (!req.body.Victor || !req.body.Loser) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'This request body must contain a Victor and a Loser'});
            return;
        }
        const retrievedMatch: DataReturnDTO = await MongoDb.getById(MatchController.table, req.query.id);
        if (!retrievedMatch.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: retrievedMatch.data});
            return false;
        }
        const match: Match = retrievedMatch.data;
        if (match.In_Conflict) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'This match is in a conflict only a league owner can resolve this'});
            return false;
        }
        if (req.body.Victor !== match.Home && req.body.Victor !== match.Away) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The victor must be either the home or away team'});
            return false;
        }
        if (req.body.Loser !== match.Home && req.body.Loser !== match.Away) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The loser must be either the home or away team'});
            return false;
        }
        if (req.body.Updated_By !== match.Home && req.body.Updated_By !== match.Away) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Only teams that played the match can report the results'});
            return false;
        }

        return true;
    }
}

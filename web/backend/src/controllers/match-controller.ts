import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';
import {DataReturnDTO, DataValidDTO, League, Team} from '../models';
import {Match} from '../models/match';
import {IController} from './controller.interface';
import {RequestValidation} from './validation';

export class MatchController implements IController {
    private table: string = 'match';

    public async delete(req: Request, res: Response) {
        if (!await RequestValidation.RecordExists(req, res, this.table)) {
            return;
        }
        if (await MongoDb.deleteById(this.table, req.query.id)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'Successfully Deleted match with id ' + req.query.id});
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error delete failed'});
            return;
        }
    }

    public async get(req: Request, res: Response) {
        let out: DataReturnDTO;
        if (req.query.id) {
            if (req.query.id.length === MongoDb.MONGO_ID_LEN) { // Retrieve match by id
                out = await MongoDb.getById(this.table, req.query.id);
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The specified id is malformed'});
                return;
            }
        } else if (req.query.name) {
            if (req.query.name.length > 0) { // Retrieve match by name
                out = await MongoDb.getByName(this.table, req.query.name);
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The name specified is invalid'});
                return;
            }
        } else {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'A Name or Id must be specified for this request'});
            return;
        }
        if (out.valid) {
            if (out.data) {
                res.statusCode = HttpStatus.OK;
                res.json(out.data);
                return;
            } else {
                res.statusCode = HttpStatus.NOT_FOUND;
                res.json([]);
                return;
            }
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json(out.data);
            return;
        }
    }

    public async getAll(req: Request, res: Response) {
        const out = await MongoDb.getAll(this.table);
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

    public async post(req: Request, res: Response) {
        const isMatchValid = await Match.validate(req);
        if (!isMatchValid.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: isMatchValid.error});
            return;
        }
        const homeTeam: Team = (await MongoDb.getById('team', req.body.Home)).data;
        const awayTeam: Team = (await MongoDb.getById('team', req.body.Away)).data;
        const match: Match = new Match(req.body, homeTeam, awayTeam);
        if (await MongoDb.save(this.table, match)) {
            res.statusCode = HttpStatus.OK;
            res.json(match);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error creation failed'});
            return;
        }

    }

    public async put(req: Request, res: Response) {
        const isValidMatch: DataValidDTO = await Match.validateUpdate(req);
        if (!isValidMatch.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: isValidMatch.error});
            return;
        }
        if (!await RequestValidation.RecordExistsWithBody(req, res, this.table)) {
            return;
        }
        if (await MongoDb.updateById(this.table, req.query.id, req.body)) {
            res.statusCode = HttpStatus.OK;
            res.json((await MongoDb.getById(this.table, req.query.id)).data);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error update failed'});
            return;
        }
    }

    // public async confirmMatch(req: Request, res: Response) {
    //
    // }
    //
    // public async completeMatch(req: Request, res: Response) {
    //
    // }

    public async setScore(req: Request, res: Response) {
        if (!await RequestValidation.ValidScoreBody(res, req, this.table)) {
            return;
        }
        const retrievedMatch: DataReturnDTO = await MongoDb.getById(this.table, req.query.id);
        if (!retrievedMatch.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: retrievedMatch.data});
            return;
        }
        if (retrievedMatch.data.Away_Score) {
            const validUpdate: DataValidDTO = await this.checkConflict(retrievedMatch.data, req.body);
            if (!validUpdate.valid) {
                res.statusCode = HttpStatus.CONFLICT;
                res.json({Message: validUpdate.error});
                return;
            }
        } else {
            await MongoDb.updateById(this.table, req.body.id, {
                Away_Score: req.body.Away_Score,
                Home_Score: req.body.Home_Score,
            });
        }
        res.statusCode = HttpStatus.OK;
        res.json({Message: 'The score for match' + req.body.id + ' has been set'});
        return;
    }

    private async checkConflict(match: Match, matchReq): Promise<DataValidDTO> {
        if (match.Away_Score !== matchReq.Away_Score) {
            await MongoDb.updateById(this.table, matchReq.id, {In_Conflict: true});
            return new DataValidDTO(false, 'Away Score do not match. This match has been marked as conflicted');
        }
        if (match.Home_Score !== matchReq.Home_Score) {
            await MongoDb.updateById(this.table, matchReq.id, {In_Conflict: true});
            return new DataValidDTO(false, 'Home Scores do not match. This match has been marked as conflicted');
        }
        return new DataValidDTO(true, '');
    }
}

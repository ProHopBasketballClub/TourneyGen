import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';
import {DataReturnDTO, DataValidDTO, Team} from '../models';
import {Match} from '../models/match';
import {IController} from './controller.interface';
import {RequestValidation} from './validation';

export class MatchController implements IController {
    public static table: string = 'match';

    public async delete(req: Request, res: Response) {
        if (!await RequestValidation.RecordExists(req, res, MatchController.table)) {
            return;
        }
        if (await MongoDb.deleteById(MatchController.table, req.query.id)) {
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
                out = await MongoDb.getById(MatchController.table, req.query.id);
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The specified id is malformed'});
                return;
            }
        } else if (req.query.name) {
            if (req.query.name.length > 0) { // Retrieve match by name
                out = await MongoDb.getByName(MatchController.table, req.query.name);
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
        const out = await MongoDb.getAll(MatchController.table);
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
        if (await MongoDb.save(MatchController.table, match)) {
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
        if (!await RequestValidation.RecordExistsWithBody(req, res, MatchController.table)) {
            return;
        }
        if (await MongoDb.updateById(MatchController.table, req.query.id, req.body)) {
            res.statusCode = HttpStatus.OK;
            res.json((await MongoDb.getById(MatchController.table, req.query.id)).data);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error update failed'});
            return;
        }
    }

    public async reportMatch(req: Request, res: Response) {
        if (!await RequestValidation.RecordExistsWithBody(req, res, MatchController.table)) {
            return;
        }
        if (!await RequestValidation.validMatchReport(req, res)) {
            return;
        }
        const retrievedMatch = await MongoDb.getById(MatchController.table, req.query.id);
        if (!retrievedMatch.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: retrievedMatch.data});
            return;
        }
        if (retrievedMatch.data.Victor) {
            const conflict = await this.checkConflict(retrievedMatch.data, req.body);
            if (!conflict.valid) {
                res.statusCode = HttpStatus.CONFLICT;
                res.json({error: conflict.error});
                return;
            }
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'This match has been confirmed by both teams'});
            return;
        }

        const result = {
            Away_Score: req.body.Away_Score,
            Home_Score: req.body.Home_Score,
            Loser: req.body.Loser,
            Victor: req.body.Victor,
        };

        if (await MongoDb.updateById(MatchController.table, req.query.id, result)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'The match has been updated by 1 team waiting on other team for confirmation'});
            return;
        }

    }

    private async checkConflict(match: Match, matchReq): Promise<DataValidDTO> {
        if (match.Away_Score !== matchReq.Away_Score) {
            await MongoDb.updateById(MatchController.table, matchReq.id, {In_Conflict: true});
            return new DataValidDTO(false, 'Away Score do not match. This match has been marked as conflicted');
        }
        if (match.Home_Score !== matchReq.Home_Score) {
            await MongoDb.updateById(MatchController.table, matchReq.id, {In_Conflict: true});
            return new DataValidDTO(false, 'Home Scores do not match. This match has been marked as conflicted');
        }
        if (match.Victor) {
            if (match.Victor !== matchReq.Victor) {
                return new DataValidDTO(false, 'Victors do not match. This match has been marked as conflicted');
            }
            if (match.Loser !== matchReq.Loser) {
                return new DataValidDTO(false, 'Losers do not match. This match has been marked as conflicted');
            }
            return new DataValidDTO(true, '');
        }
    }
}

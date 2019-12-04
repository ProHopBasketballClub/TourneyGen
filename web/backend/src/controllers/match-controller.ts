import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';
import {DataReturnDTO, DataValidDTO, Team} from '../models';
import {Match, Match_Status} from '../models/match';
import {IController} from './controller.interface';
import {LeagueController} from './league-controller';
import {TeamController} from './team-controller';
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
            const homeMatchList: string[] = homeTeam.Matches ? homeTeam.Matches : [];
            homeMatchList.push(match._id);
            const awayMatchList: string[] = awayTeam.Matches ? awayTeam.Matches : [];
            awayMatchList.push(match._id);
            await MongoDb.updateById(TeamController.table, homeTeam._id, {Matches: homeMatchList});
            await MongoDb.updateById(TeamController.table, awayTeam._id, {Matches: awayMatchList});
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

    public async resolveConflict(req: Request, res: Response) {
        if (!await RequestValidation.RecordExistsWithBody(req, res, MatchController.table)) {
            return;
        }
        if (!await RequestValidation.validMatchReport(req, res)) {
            return;
        }
        if (!req.query.Owner) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'A league owner must be specified in the query if this request'});
            return;
        }
        const retrievedMatch = await MongoDb.getById(MatchController.table, req.query.id);
        if (retrievedMatch.data.Status !== Match_Status.Conflicted) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'This match is not in conflict. A team can update it'});
            return;
        }
        const retrievedTeam = await MongoDb.getById(TeamController.table, retrievedMatch.data.Home);
        if (!retrievedTeam.valid || !retrievedTeam.data) {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Could Not retrieve team'});
            return;
        }
        const retrievedLeague = await MongoDb.getById(LeagueController.table, retrievedTeam.data.League);
        if (!retrievedLeague.valid || !retrievedLeague.data) {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Could Not retrieve league'});
            return;
        }
        if (req.query.Owner !== retrievedLeague.data.Owner) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Only the league owner can resolve conflicts'});
            return;
        }
        const result = {
            Away_Score: req.body.Away_Score,
            Home_Score: req.body.Home_Score,
            Loser: req.body.Loser,
            Status: Match_Status.Confirmed,
            Updated_By: 'Owner',
            Victor: req.body.Victor,

        };

        if (await MongoDb.updateById(MatchController.table, req.query.id, result)) {
            const match: Match = (await MongoDb.getById(MatchController.table, req.query.id)).data;
            await Team.updateStats(match);
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'The conflict has been resolved and the match has been confirmed'});
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
            const conflict = await this.checkConflict(retrievedMatch.data, req);
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
            Updated_By: req.body.Updated_By,
            Victor: req.body.Victor,
        };

        if (await MongoDb.updateById(MatchController.table, req.query.id, result)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'The match has been updated by 1 team waiting on other team for confirmation'});
            return;
        }

    }

    private async checkConflict(match: Match, matchReq): Promise<DataValidDTO> {
        if (match.Status === Match_Status.Conflicted) {
            return new DataValidDTO(false, 'This match is in a conflict it can only be updated by a league owner');
        }

        if (match.Away_Score !== matchReq.body.Away_Score) {
            await MongoDb.updateById(MatchController.table, matchReq.query.id, {Status: Match_Status.Conflicted});
            return new DataValidDTO(false, 'Away Score do not match. This match has been marked as conflicted');
        }
        if (match.Home_Score !== matchReq.body.Home_Score) {
            await MongoDb.updateById(MatchController.table, matchReq.query.id, {Status: Match_Status.Conflicted});
            return new DataValidDTO(false, 'Home Scores do not match. This match has been marked as conflicted');
        }
        if (match.Victor) {
            if (match.Victor !== matchReq.body.Victor) {
                return new DataValidDTO(false, 'Victors do not match. This match has been marked as conflicted');
            }
            if (match.Loser !== matchReq.body.Loser) {
                return new DataValidDTO(false, 'Losers do not match. This match has been marked as conflicted');
            }
            if (matchReq.body.Updated_By !== match.Updated_By) {
                if (!await MongoDb.updateById(MatchController.table, match._id, {Status: Match_Status.Confirmed})) {
                    return new DataValidDTO(false, 'Internal Server error confirmation not set');
                }
                await Team.updateStats(match);
            }
            return new DataValidDTO(true, '');
        }
    }
}

import {Request, Response} from 'express';
import {BAD_REQUEST} from 'http-status-codes';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';
import {DataReturnDTO, DataValidDTO} from '../models';
import {Tournament} from '../models/tournament';
import {IController} from './controller.interface';
import {RequestValidation} from './validation';

export class TournamentController implements IController {
    public static table: string = 'tournament';

    public async delete(req: Request, res: Response) {
        if (!await RequestValidation.RecordExists(req, res, TournamentController.table)) {
            return;
        }
        if (await MongoDb.deleteById(TournamentController.table, req.query.id)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'Successfully Deleted tournament with id ' + req.query.id});
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
            if (req.query.id.length === MongoDb.MONGO_ID_LEN) { // Retrieve league by id
                out = await MongoDb.getById(TournamentController.table, req.query.id);
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The specified id is malformed'});
                return;
            }
        } else if (req.query.name) {
            if (req.query.name.length > 0) { // Retrieve League by name
                out = await MongoDb.getByName(TournamentController.table, req.query.name);
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
        const out = await MongoDb.getAll(TournamentController.table);
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
        const validTour: DataValidDTO = await Tournament.validate(req);
        if (!validTour.valid) {
            res.statusCode = BAD_REQUEST;
            res.json({error: validTour.error});
            return;
        }
        const tournament = new Tournament(req);
        if (await MongoDb.save(TournamentController.table, tournament)) {
            res.statusCode = HttpStatus.OK;
            res.json(tournament);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error creation failed'});
            return;
        }
    }

    public async put(req: Request, res: Response) {
        if (!await RequestValidation.RecordExistsWithBody(req, res, TournamentController.table)) {
            return;
        }
        const validTour: DataValidDTO = await Tournament.validUpdate(req);
        if (!validTour.valid) {
            res.statusCode = BAD_REQUEST;
            res.json({error: validTour.error});
            return;
        }
        if (await MongoDb.updateById(TournamentController.table, req.query.id, req.body)) {
            res.statusCode = HttpStatus.OK;
            res.json(await MongoDb.getById(TournamentController.table, req.query.id));
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error creation failed'});
            return;
        }
    }
}

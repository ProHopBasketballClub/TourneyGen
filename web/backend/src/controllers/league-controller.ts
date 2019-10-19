import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db/mongo.db';
import {DataReturnDTO, DataValidDTO, League} from '../models';
import {IController} from './controller.interface';

export class LeagueController implements IController {
    private table: string = 'league';

    public async delete(req: Request, res: Response) {
        if (!req.query.id) {
            res.json({error: 'Id must be specified as a param of this request'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.json({error: 'You cannot delete a league that does not exist'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (await MongoDb.deleteById(this.table, req.query.id)) {
            res.json({Msg: 'Successfully Deleted league with id ' + req.query.id});
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json({error: 'Internal Server Error delete failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
    }

    public async get(req: Request, res: Response) {
        let out: DataReturnDTO;

        if (req.query.id && req.query.id.length === MongoDb.MONGO_ID_LEN) { // Retrieve league by id
            out = await MongoDb.getById(this.table, req.query.id);
        } else if (req.query.Name && req.query.Name.length > 0) { // Retrieve League by name
            out = await MongoDb.getByName(this.table, req.query.id);
        }

        if (out.valid) {
            res.json(out.data);
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json(out.data);
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
    }

    public async getAll(req: Request, res: Response) {
        const out = await MongoDb.getAll(this.table);
        if (out.valid) {
            res.json(out.data);
            res.statusCode = HttpStatus.OK;
        } else {
            res.json(out.data);
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
    }

    // create a league object
    public async post(req: Request, res: Response) {
        const validLeague: DataValidDTO = await League.validate(req);
        if (!validLeague.valid) {
            res.json(validLeague.error);
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        } else {
            const league: League = new League(req.query.Owner, req.query.Name, req.query.Description, req.query.Game_type);
            if (await MongoDb.save(this.table, league)) {
                res.json(league);
                res.statusCode = HttpStatus.OK;
                return;
            } else {
                res.json({error: 'Internal Server Error creation failed'});
                res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                return;
            }
        }
    }

    // update an existing league object
    public async put(req: Request, res: Response) {
        const validLeague: DataValidDTO = await League.validate(req);
        if (!validLeague) {
            res.json({error: validLeague.error});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if (!req.query.id || req.query.id) {
            res.json({error: 'The id in this request is not valid'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.json({error: 'You cannot update a league that does not exist'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        const league: League = new League(req.query.Owner, req.query.Name, req.query.Description, req.query.Game_type);
        if (await MongoDb.updateById(this.table, req.query.id, league)) {
            league._id = req.query.id;
            res.json(league);
            res.statusCode = HttpStatus.OK;
            return;
        } else {
            res.json({error: 'Internal Server Error update failed'});
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
    }
}

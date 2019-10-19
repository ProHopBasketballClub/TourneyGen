import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db/mongo.db';
import {DataReturnDTO, DataValidDTO, League} from '../models';
import {IController} from './controller.interface';

/**
 * Controller defining the CRUD methods for league
 *
 * @export
 */

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
        if (req.query.id) {
            if (req.query.id.length === MongoDb.MONGO_ID_LEN) { // Retrieve league by id
                out = await MongoDb.getById(this.table, req.query.id);
            } else {
                res.json({error: 'The specified id is malformed'});
            }
        } else if (req.query.Name) {
            if (req.query.Name.length > 0) { // Retrieve League by name
                out = await MongoDb.getByName(this.table, req.query.id);
            } else {
                res.json({error: 'The name specified is invalid'});
                res.statusCode = HttpStatus.BAD_REQUEST;
            }
        } else {
            res.json({error: 'A Name or Id must be specified for this request'});
            res.statusCode = HttpStatus.BAD_REQUEST;
        }

        if (out.valid) {
            if (out.data) {
                res.json(out.data);
                res.statusCode = HttpStatus.OK;
                return;
            } else {
                res.json([]);
                res.statusCode = HttpStatus.NOT_FOUND;
                return;
            }
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
        let validLeague: DataValidDTO;
        try {
            validLeague = await League.validate(req);
        } catch (e) {
            console.log(e);
        }

        console.log(validLeague + 'dthfesuifhios');
        if (!validLeague.valid) {
            res.json({error: validLeague.error});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        } else {
            const league: League = new League(req.body.Owner, req.body.Name, req.body.Description, req.body.Game_type);
            console.log(league);
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
        if (!req.query.id || req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.json({error: 'The id in this request is not valid'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.json({error: 'You cannot update a league that does not exist'});
            res.statusCode = HttpStatus.BAD_REQUEST;
            return;
        }
        const league: League = new League(req.body.Owner, req.body.Name, req.body.Description, req.body.Game_type);
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

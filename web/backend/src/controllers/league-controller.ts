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
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Id must be specified as a param of this request'});
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot delete a league that does not exist'});
            return;
        }
        if (await MongoDb.deleteById(this.table, req.query.id)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'Successfully Deleted league with id ' + req.query.id});
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
                out = await MongoDb.getById(this.table, req.query.id);
            } else {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'The specified id is malformed'});
                return;
            }
        } else if (req.query.name) {
            if (req.query.name.length > 0) { // Retrieve League by name
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

    public async getAll(req, res) {
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

    // create a league object
    public async post(req: Request, res: Response) {
        let validLeague: DataValidDTO;
        console.log(req.body );
        validLeague = await League.validate(req);
        if (!validLeague.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: validLeague.error});
            return;
        } else {
            const league: League = new League(req.body.Owner, req.body.Name, req.body.Description, req.body.Game_type);
            if ((await MongoDb.getByName(this.table, req.body.Name)).data) {
                res.statusCode = HttpStatus.BAD_REQUEST;
                res.json({error: 'A league with this name already exists'});
            }

            if (await MongoDb.save(this.table, league)) {
                res.statusCode = HttpStatus.OK;
                res.json(league);
                return;
            } else {
                res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                res.json({error: 'Internal Server Error creation failed'});
                return;
            }
        }
    }

    // update an existing league object
    public async put(req: Request, res: Response) {
        const validLeague: DataValidDTO = await League.validate(req);
        if (!validLeague) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: validLeague.error});
            return;
        }
        if (!req.query.id || req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The id in this request is not valid'});
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot update a league that does not exist'});
            return;
        }
        const league: League = new League(req.body.Owner, req.body.Name, req.body.Description, req.body.Game_type);
        if (await MongoDb.updateById(this.table, req.query.id, league)) {
            league._id = req.query.id;
            res.statusCode = HttpStatus.OK;
            res.json(league);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error update failed'});
            return;
        }
    }
}

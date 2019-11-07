import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../db';
import {DataReturnDTO, DataValidDTO, League, Team} from '../models';
import {IController} from './controller.interface';

export class TeamController implements IController {
    private table: string = 'team';

    public async delete(req: Request, res: Response) {
        if (!req.query.id || req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'Id must be specified as a param of this request'});
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot delete a team that does not exist'});
            return;
        }
        if (await MongoDb.deleteById(this.table, req.query.id)) {
            res.statusCode = HttpStatus.OK;
            res.json({Msg: 'Successfully Deleted team with id ' + req.query.id});
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
        const isTeamValid = await Team.validate(req);
        if (!isTeamValid.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: isTeamValid.error});
            return;
        }
        const team: Team = new Team(req.body.Roster, req.body.Owner, req.body.Name, req.body.Description);
        if (await MongoDb.save(this.table, team)) {
            res.statusCode = HttpStatus.OK;
            res.json(team);
            return;
        } else {
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            res.json({error: 'Internal Server Error creation failed'});
            return;
        }
    }

    public async put(req: Request, res: Response) {
        const isValidTeam: DataValidDTO = await Team.validateUpdate(req);
        if (!isValidTeam.valid) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: isValidTeam.error});
            return;
        }
        if (!req.query.id || req.query.id.length !== MongoDb.MONGO_ID_LEN) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.json({error: 'The id in this request is not valid'});
            return;
        }
        if ((await MongoDb.getById(this.table, req.query.id)).data === null) {
            res.statusCode = HttpStatus.NOT_FOUND;
            res.json({error: 'You cannot update a teama= that does not exist'});
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
}

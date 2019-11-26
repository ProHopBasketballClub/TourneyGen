import {Request} from 'express';
import {LeagueController} from '../controllers';
import {TeamController} from '../controllers/team-controller';
import {TournamentController} from '../controllers/tournament-controller';
import {MongoDb} from '../db';
import {DataReturnDTO} from './DTOs/dataReturnDTO';
import {DataValidDTO} from './DTOs/dataValidDTO';

export class Tournament {
    public static MIN_TEAM_COUNT: number = 3;

    public static async validate(req: Request): Promise<DataValidDTO> {
        if (!req.body.Name || req.body.Name.length < 1) {
            return new DataValidDTO(false, 'A name for the tournament is required');
        }
        if (!req.body.Teams || req.body.Team.length < Tournament.MIN_TEAM_COUNT) {
            return new DataValidDTO(false, 'A Tournament for the league is required');
        }
        if (!req.body.Description || req.body.Description.length < 1) {
            return new DataValidDTO(false, 'A Description for the tournament is required');
        }
        if (!req.body.League || req.body.League.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'A valid league id is required');
        }
        const league: DataReturnDTO = await MongoDb.getById(LeagueController.table, req.body.League);
        if (!league.valid || !league.data) {
            return new DataValidDTO(false, 'A valid league id is required');
        }
        if (!this.validTeamObject(req.body.Teams)) {
            return new DataValidDTO(false, 'One or more of the team ids provided is not valid');
        }
        // This checks to make sure tournament names are league unique
        if (await this.nameExists(req.body.Name, req.body.League)) {
            return new DataValidDTO(false, 'A Tournament with this name exists in the league already');
        }

        return new DataValidDTO(true, '');
    }

    public static async validUpdate(req: Request): Promise<DataValidDTO> {
        if ('Name' in req.body) {
            if (req.body.Name.length < 1) {
                return new DataValidDTO(false, 'A name for the tournament is required');
            }
            const tour = await MongoDb.getByName(TournamentController.table, req.body.Name);
            if (tour.data && req.query.id !== tour.data._id) {
                return new DataValidDTO(false, 'A Tournament with this name already exists in this league');
            }
        }

        if ('Description' in req.body) {
            if (req.body.Description.length < 1) {
                return new DataValidDTO(false, 'A Description for the tournament is required');
            }
        }
        if ('Teams' in req.body) {
            if (req.body.Teams.length || !this.validTeamObject(req.body.Teams)) {
                return new DataValidDTO(false, 'One or more of the team ids provided is not valid');
            }
        }
        if ('League' in req.body) {
            return new DataValidDTO(false, 'The league of a tournament cannot be changed');
        }
        if ('Matches' in req.body) {
            return new DataValidDTO(false, 'Tournament matches are auto generated and cannot be changed');
        }
    }

    private static async validTeamObject(teams: [string]): Promise<boolean> {
        for (const t of teams) {
            if (t.length !== MongoDb.MONGO_ID_LEN) {
                return false;
            }
            const team = await MongoDb.getById(TeamController.table, t);
            if (!team.valid || !team.data) {
                return false;
            }
        }
        return true;
    }

    private static async nameExists(Name: string, leagueId: string): Promise<boolean> {
        const league = await MongoDb.getById(LeagueController.table, leagueId);
        if (!league.valid || !league.data) {
            return false;
        }
        for (const tourId of league.data.Tournaments) {
            const tournament: Tournament = (await MongoDb.getById(TournamentController.table, tourId)).data;
            if (tournament.Name === Name) {
                return true;
            }
        }
        return false;
    }

    public _id: string;
    public Teams: [string];
    public Matches: [string];
    public League: string;
    public Name: string;
    public Description: string;
    public Generated: boolean = false;
    public DisplayObject;

    public constructor(req: Request) {
        this.Teams = req.body.Teams;
        this.Description = req.body.Description;
        this.League = req.body.League;
        this.Name = req.body.Name;

    }
}

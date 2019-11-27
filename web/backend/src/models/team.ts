import {Request} from 'express';
import {LeagueController} from '../controllers';
import {TeamController} from '../controllers/team-controller';
import {MongoDb} from '../db';
import {DataReturnDTO} from './DTOs/dataReturnDTO';
import {DataValidDTO} from './DTOs/dataValidDTO';
import {League} from './league';

export class Team {

    public static async validate(req: Request) {
        if (!Object.keys(req.body).length) {
            return new DataValidDTO(false, 'A team object is required in the body of this request');
        }
        if (!req.body.Owner || req.body.Owner.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'Invalid Owner Id');
        }
        const retrievedUser: DataReturnDTO = await MongoDb.getById('user', req.body.Owner);
        if (!retrievedUser.valid || !retrievedUser.data) {
            return new DataValidDTO(false, 'The Owner could not be found');
        }
        if (!req.body.Description || req.body.Description.length < 1) {
            return new DataValidDTO(false, 'A team must have a description');
        }
        if (!req.body.Name || req.body.Name.length < 1) {
            return new DataValidDTO(false, 'A team must have a name');
        }
        const league: League = (await MongoDb.getById(LeagueController.table, req.body.League)).data;
        if (league.Teams) {
            for (const id of league.Teams) {
                const teamName = (await MongoDb.getById(TeamController.table, id)).data.Name;
                if (req.body.Name === teamName) {
                    return new DataValidDTO(false, 'A team with this name already exists in this league');
                }
            }
        }
        if (!req.body.Roster || req.body.Roster.length < 1) {
            return new DataValidDTO(false, 'A team requires at least 1 player');
        }
        if (!req.body.League || req.body.League.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'A Team must belong to a league');
        }
        const retrievedLeague = await MongoDb.getById(LeagueController.table, req.body.League);
        if (!retrievedLeague.valid) {
            return new DataValidDTO(false, 'Internal Server error League could not be retrieved');
        }
        if (!retrievedLeague.data) {
            return new DataValidDTO(false, 'A Team must belong to a league');
        }
        for (const player of req.body.Roster) {
            if (player.length < 1) {
                return new DataValidDTO(false, 'The roster contains invalid names');
            }
        }
        return new DataValidDTO(true, '');
    }

    public static async validateUpdate(req: Request) {
        if (!Object.keys(req.body).length) {
            return new DataValidDTO(false, 'A team object is required in the body of this request');
        }
        if (req.body.Owner) {
            const retrievedUser: DataReturnDTO = await MongoDb.getById('user', req.body.Owner);
            if (!retrievedUser.valid || !retrievedUser.data) {
                return new DataValidDTO(false, 'The Owner could not be found');
            }
        }
        if ('Description' in req.body) {
            if (req.body.Description.length < 1) {
                return new DataValidDTO(false, 'A team must have a description');
            }
        }
        if ('Name' in req.body) {
            if (req.body.Name.length < 1) {
                return new DataValidDTO(false, 'A team must have a name');
            }
            const team: Team = (await MongoDb.getByName('team', req.body.Name)).data;
            if (team && JSON.stringify(req.query.id) !== JSON.stringify(team._id)) {
                return new DataValidDTO(false, 'A team with this name already exists');
            }
        }
        if ('Roster' in req.body) {
            if (req.body.Roster.length < 1) {
                return new DataValidDTO(false, 'A team requires at least 1 player');
            }
            for (const player of req.body.Roster) {
                if (player.length < 1) {
                    return new DataValidDTO(false, 'The roster contains invalid names');
                }
            }
        }
        return new DataValidDTO(true, '');
    }

    public _id: string;
    public Roster: [string]; // The list of players on this team
    public Wins: number;
    public Losses: number;
    public Ties: number;
    public Rating: number; // The MMR of the team
    public Owner: string; // The user id of the owner
    public Name: string; // The name of the team
    public Description: string;
    public Logo: string; // The logo image id for mongo
    public Upcoming_Matches: [string]; // List of upcoming matches
    public League: string;

    constructor(roster: [string], owner: string, name: string, description: string, legaue: string) {
        this.Roster = roster;
        this.Owner = owner;
        this.Name = name;
        this.Description = description;
        this.League = legaue;
    }
}

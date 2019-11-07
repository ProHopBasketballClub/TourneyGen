import {Request} from 'express';
import {MongoDb} from '../db';
import {DataReturnDTO} from './DTOs/dataReturnDTO';
import {DataValidDTO} from './DTOs/dataValidDTO';

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
        if ((await MongoDb.getByName('team', req.body.Name)).data) {
            return new DataValidDTO(false, 'A team with this name already exists');
        }
        if (!req.body.Roster || req.body.Roster.length < 1) {
            return new DataValidDTO(false, 'A team requires at least 1 player');
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
        if (req.body.Description) {
            if (req.body.Description.length < 1) {
                return new DataValidDTO(false, 'A team must have a description');
            }
        }
        if (req.body.Name) {
            if (req.body.Name.length < 1) {
                return new DataValidDTO(false, 'A team must have a name');
            }
            if ((await MongoDb.getByName('team', req.body.Name)).data) {
                return new DataValidDTO(false, 'A team with this name already exists');
            }
        }
        if (req.body.Roster) {
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
    public Upcoming_Matches: [string]; // List of upcoming

    constructor(roster: [string], owner: string, name: string, description: string) {
        this.Roster = roster;
        this.Owner = owner;
        this.Name = name;
        this.Description = description;
    }
}

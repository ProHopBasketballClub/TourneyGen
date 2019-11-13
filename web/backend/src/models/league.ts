import {Request} from 'express';
import {MongoDb} from '../db/mongo.db';
import {DataValidDTO} from './DTOs/dataValidDTO';

export class League {

    public static async validate(req: Request): Promise<DataValidDTO> {
        if (!req.body.Owner || req.body.Owner.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'A league owner must be specified');
        }
        const retrievedOwner = await MongoDb.getById('user', req.body.Owner);
        if (retrievedOwner.valid === false || !retrievedOwner.data) { // Make sure the owner exists in the database
            return new DataValidDTO(false, 'The specified league owner could not be found');
        }
        if (!req.body.Game_type || req.body.Game_type.length < 1) {
            return new DataValidDTO(false, 'A game type is required');
        }
        if (!req.body.Name || req.body.Name.length < 1) {
            return new DataValidDTO(false, 'A Name for the league is required');
        }
        if (!req.body.Description || req.body.Description.length < 1) {
            return new DataValidDTO(false, 'A Description is required');
        }
        return new DataValidDTO(true, '');
    }

    public static async validateUpdate(req: Request) {
        if (Object.keys(req.body).length < 1) {
            return new DataValidDTO(false, 'A league is required in the body of this request');
        }
        if (req.body.Owner) {
            if (req.body.Owner.length !== MongoDb.MONGO_ID_LEN) {
                return new DataValidDTO(false, 'A league owner must be specified');
            }
            const retrievedOwner = await MongoDb.getById('user', req.body.Owner);
            if (retrievedOwner.valid === false || !retrievedOwner.data) { // Make sure the owner exists in the database
                return new DataValidDTO(false, 'The specified league owner could not be found');
            }
        }
        if (req.body.Name) {
            if (req.body.Name.length < 1) {
                return new DataValidDTO(false, 'A Name for the league is required');
            }
        }
        if (req.body.Description) {
            if (req.body.Description.length < 1) {
                return new DataValidDTO(false, 'A Description is required');
            }
        }
        if (req.body.Game_type) {
            if (req.body.Game_type.length < 1) {
                return new DataValidDTO(false, 'A game type is required');
            }
        }
        return new DataValidDTO(true, '');
    }

    public _id: string; // The mongo id of this object
    public Owner: string;// This will be the UID of the user that owns the league
    public Name: string; // This is the name of the league
    public Description: string;
    public Logo: Uint8Array; // This will store images as bytes
    public Game_type: string;// The game that this league plays
    public Tournaments: string[];// This will hold the UIDs of tournaments in this league
    public Teams: string[]; // This will hold the UIDs of teams in this league

    constructor(owner: string, name: string, description: string, game_type: string) {
        this.Owner = owner;
        this.Name = name;
        this.Description = description;
        this.Game_type = game_type;
    }
}

import {Request} from 'express';
import {MongoDb} from '../db/mongo.db';
import {DataValidDTO} from './dataValidDTO';
import {User} from './user';

export class League {

    public static async validate(req: Request): Promise<DataValidDTO> {
        if (!req.query.Owner || req.query.Owner.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'A league owner must be specified');
        }
        const retreviedOwner = await MongoDb.getById('user', req.query.Owner);
        if (retreviedOwner.valid === false || retreviedOwner.data.empty) { // Make sure the owner exists in the database
            return new DataValidDTO(false, 'The specified league owner could not be found');
        }
        if (!req.query.Game_type.length || req.query.Game_type.length < 1) {
            return new DataValidDTO(false, 'A game type is required');
        }
        if (!req.query.Name || req.query.Name.length < 1) {
            return new DataValidDTO(false, 'A Name for the league is required');
        }
        if (!req.query.Description || req.query.Description.length < 1) {
            return new DataValidDTO(false, 'A Description is required');
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

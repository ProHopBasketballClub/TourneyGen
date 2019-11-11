import {Request} from 'express';
import {DataValidDTO} from './DTOs/dataValidDTO';

export class Match {

    public static async validate(req: Request) {
        if (!Object.keys(req.body).length) {
            return new DataValidDTO(false, 'A team object is required in the body of this request');
        }
        if (!req.body.Home || req.body.Home.length < 1) {
            return new DataValidDTO(false, 'A home team must be specified');
        }

        if (!req.body.Visitor || req.body.Away.length < 1) {
            return new DataValidDTO(false, 'A home away must be specified');
        }
    }

    public static async validateUpdate(req: Request) {
        if (!Object.keys(req.body).length) {
            return new DataValidDTO(false, 'A team object is required in the body of this request');
        }

        if (!req.body.Home) {
            if (req.body.Home.length < 1) {
                return new DataValidDTO(false, 'A home team must be specified');
            }
        }

        if (!req.body.Visitor) {
            if (req.body.Away.length < 1) {
                return new DataValidDTO(false, 'A home away must be specified');
            }
        }
    }

    public _id: string; // The match id
    public Match: string;
    public Home: string; // The id of the home team
    public Visitor: string; // The id of the away team
    public Victor: string; // The id of the winning team
    public Loser: string; // The id of the losing team
    public Victor_Score: number;
    public Loser_Score: number;
    public Confirmed: boolean;
    public In_Conflict: boolean; // If the match result is contested
    public Fill_From: [number, number];
    public Tournament_Id: string; // The id of the tournament the match is in. Not required

    constructor(req: Request) {
        this.Home = req.body.Home;
        this.Victor = req.body.Away;
    }
}

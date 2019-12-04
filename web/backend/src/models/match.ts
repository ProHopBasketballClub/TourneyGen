import {Request} from 'express';
import {MongoDb} from '../db';
import {DataValidDTO} from './DTOs/dataValidDTO';

export class Match {

    public static async validate(req: Request) {
        if (!Object.keys(req.body).length) {
            return new DataValidDTO(false, 'A team object is required in the body of this request');
        }

        if (!req.body.League) {
            return new DataValidDTO(false, 'A league must be specified for this match');
        }

        if (!req.body.Home || req.body.Home.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'A home team must be specified');
        }

        if (!req.body.Away || req.body.Away.length !== MongoDb.MONGO_ID_LEN) {
            return new DataValidDTO(false, 'A home away must be specified');
        }
        if (req.body.Away === req.body.Home) {
            return new DataValidDTO(false, 'A team cannot play itself');
        }
        const homeTeam = await MongoDb.getById('team', req.body.Home);
        const awayTeam = await MongoDb.getById('team', req.body.Away);

        if (!homeTeam.valid || !homeTeam.data) {
            return new DataValidDTO(false, 'The specified home team was not found');
        }
        if (!awayTeam.valid || !awayTeam.data) {
            return new DataValidDTO(false, 'The specified away team was not found');
        }
        return new DataValidDTO(true, '');
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
        if (!req.body.Away) {
            if (req.body.Away.length < 1) {
                return new DataValidDTO(false, 'An away team must be specified');
            }
        }
    }

    public _id: string; // The match id
    public Title: string;
    public Home: string; // The id of the home team
    public Away: string; // The id of the away team
    public Victor: string; // The id of the winning team
    public League: string; // The id of the league the match is in
    public Loser: string; // The id of the losing team
    public Home_Score: number = 0;
    public Away_Score: number = 0;
    public Fill_From: [number, number];
    public Tournament: string; // The id of the tournament the match is in. Not required
    public Updated_By: string;
    public Status: Match_Status;

    constructor(req, homeTeam, awayTeam) {
        this.Home = req.Home;
        this.Away = req.Away;
        this.Title = homeTeam.Name + ' VS ' + awayTeam.Name;
        this.League = req.League;
        this.Status = Match_Status.In_progress;
        if (req.Tournament) {
            this.Tournament = req.Tournament;
        } else {
            this.Tournament = 'Not part of a Tournament';
        }
    }
}

export enum Match_Status {
    In_progress,
    Pending_report,
    Confirmed,
    Conflicted,
}

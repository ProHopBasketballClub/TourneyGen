import {Request} from 'express';

export class Match {

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

}

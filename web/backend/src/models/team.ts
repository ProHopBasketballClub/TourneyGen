import {Request} from 'express';
import {LeagueController} from '../controllers';
import {MatchController} from '../controllers/match-controller';
import {TeamController} from '../controllers/team-controller';
import {MongoDb} from '../db';
import {EloService} from '../services/elo-service';
import {DataReturnDTO} from './DTOs/dataReturnDTO';
import {DataValidDTO} from './DTOs/dataValidDTO';
import {League} from './league';
import {Match} from './match';

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

    public static async updateStats(match: Match) {

        // Update the Winning team
        const victor: Team = (await MongoDb.getById(TeamController.table, match.Victor)).data;
        const loser: Team = (await MongoDb.getById(TeamController.table, match.Loser)).data;
        const elos = EloService.calculateElo(victor, loser);
        await MongoDb.updateById(TeamController.table, match.Victor, {Wins: victor.Wins + 1, Rating: elos.Victor});
        await MongoDb.updateById(TeamController.table, match.Loser, {Losses: loser.Losses + 1, Rating: elos.Loser});
    }

    public static async delete(teamId) {
        const team = await MongoDb.getById(TeamController.table, teamId);
        for (const matchId of team.data.Matches) {
            const match = await MongoDb.getById(MatchController.table, matchId);
            if (match.data.Confirmed) {
                // Home was deleted
                if (JSON.stringify(match.data.Home) === JSON.stringify(teamId)) {
                    const title = JSON.stringify(match.data.Title);
                    const titleArr = title.split(' ', 1);
                    // tslint:disable-next-line:no-magic-numbers
                    match.data.Title = 'Deleted VS ' + titleArr[2];
                } else {
                    // Away was deleted
                    let title = match.data.Title;
                    title = title.split(' ', 1);
                    match.data.Title = title[0] + ' VS Deleted';
                }
                await MongoDb.updateById(MatchController.table, matchId, {Title: match.data.Title});
            } else {
                // Home was deleted
                if (JSON.stringify(match.data.Home) === JSON.stringify(teamId)) {
                    const title = match.data.Title;
                    const titleArr = title.split(' ');
                    // tslint:disable-next-line:no-magic-numbers
                    match.data.Title = titleArr[0] + ' (Deleted) VS ' + titleArr[2];
                    match.data.Victor = match.data.Away;
                    match.data.Home_Score = -1;
                    match.data.Away_Score = 1;
                    match.data.Confirmed = true;
                } else {
                    // Away was deleted
                    let title = match.data.Title;
                    title = title.split(' ');
                    // tslint:disable-next-line:no-magic-numbers
                    match.data.Title = title[0] + ' VS ' + title[2] + '(Deleted)';
                    match.data.Victor = match.data.Home;
                    match.data.Home_Score = 1;
                    match.data.Away_Score = -1;
                    match.data.Confirmed = true;
                }
                await MongoDb.updateById(MatchController.table, matchId, match.data);
            }
        }
    }

    public _id: string;
    public Roster: [string]; // The list of players on this team
    public Wins: number = 0;
    public Losses: number = 0;
    public Rating: number = EloService.ELO_INITIAL_VALUE; // The MMR of the team
    public Owner: string; // The user id of the owner
    public Name: string; // The name of the team
    public Description: string;
    public Logo: string; // The logo image id for mongo
    public Upcoming_Matches: [string]; // List of upcoming matches
    public League: string;
    public Matches = [];

    constructor(roster: [string], owner: string, name: string, description: string, league: string) {
        this.Roster = roster;
        this.Owner = owner;
        this.Name = name;
        this.Description = description;
        this.League = league;
    }
}

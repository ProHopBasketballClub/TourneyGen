import * as HttpStatus from 'http-status-codes';
import * as mongoUnit from 'mongo-unit';
import {App} from '../../../../web/backend/src/app';
import {MongoDb} from '../../../../web/backend/src/db';

// No ec6 import exists for these packages import must be done this way
// tslint:disable-next-line:no-var-requires
const chai = require('chai');
// tslint:disable-next-line:no-var-requires
const chaiHttp = require('chai-http');

// Set up the tests for http requests
chai.use(chaiHttp);
chai.should();

describe('Tournament Controller', async function() {
    let userId: string = '';
    let leagueId: string = '';
    let tourId: string = '';
    const teamIds = [];
    let serve; // A variable for the node app
    let conn; // The variable for the connection to the server
    const TIME_OUT: number = 20000;
    const TOUR_ROOT = '/api/tournament';
    this.timeout(TIME_OUT);

    before(async () => {
        serve = new App();
        conn = await serve.express.listen();
        process.env.DB_CONNECTION_STRING = await mongoUnit.start();
    });

    before(async () => {
        let res = await chai.request(conn)
            .post('/api/user')
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            });
        userId = res.body._id;
        userId.length.should.equal(MongoDb.MONGO_ID_LEN);

        res = await chai.request(conn)
            .post('/api/league')
            .send({
                Description: 'There is none',
                Game_type: 'No one plays games anymore',
                Name: 'League',
                Owner: userId,
            });
        leagueId = res.body._id;

        // tslint:disable-next-line:no-magic-numbers
        for (let i = 0; i < 4; i++) {
            const team = {Name: 'bois' + i, Owner: userId, Roster: ['R4'], Description: 'Yes', League: leagueId};
            res = await chai.request(conn)
                .post('/api/team')
                .send(team);
            teamIds.push(res.body._id);
        }
    });

    after(async () => {
        await mongoUnit.drop();
        await mongoUnit.stop();
    });

    it('it should Create a Tournament object', async () => {
        const tour = {League: leagueId, Teams: teamIds, Name: 'Name', Description: 'yes'};
        const res = await chai.request(conn)
            .post(TOUR_ROOT)
            .send(tour);
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
        tourId = res.body._id;

    });

    it('it should get all Match object', async () => {
        const res = await chai.request(conn)
            .get(TOUR_ROOT + '/all');
        res.status.should.equal(HttpStatus.OK);
        res.body.length.should.equal(1);

    });

    it('it should get a Match object', async () => {
        const res = await chai.request(conn)
            .get(TOUR_ROOT)
            .query({id: tourId});
        res.status.should.equal(HttpStatus.OK);
    });

    // This test the tournament is added to the league
    it('it should get a update league object', async () => {
        const res = await chai.request(conn)
            .get('/api/league')
            .query({id: leagueId});
        res.status.should.equal(HttpStatus.OK);
        res.body.Tournaments.length.should.equal(1);
        res.body.Tournaments[0].should.equal(tourId);
    });

    it('it should update tournament object', async () => {
        teamIds.pop();
        const res = await chai.request(conn)
            .put(TOUR_ROOT)
            .query({id: tourId}).send({Teams: teamIds});
        res.status.should.equal(HttpStatus.OK);
        // tslint:disable-next-line:no-magic-numbers
        res.body.Teams.length.should.equal(3);
    });

    it('it should fail to update tournament object not enough teams', async () => {
        teamIds.pop();
        const res = await chai.request(conn)
            .put(TOUR_ROOT)
            .query({id: tourId}).send({Teams: teamIds});
        res.status.should.equal(HttpStatus.BAD_REQUEST);
    });

    it('it should delete tournament object', async () => {
        const res = await chai.request(conn)
            .delete(TOUR_ROOT)
            .query({id: tourId});
        res.status.should.equal(HttpStatus.OK);
    });

});

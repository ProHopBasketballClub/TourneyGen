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

describe('League Controller', async function() {
    let userId: string = '';
    let leagueId: string = '';
    let leagueName: string = '';
    let serve; // A variable for the node app
    let conn; // The variable for the connection to the server
    const TIME_OUT: number = 20000;
    const LEAGUE_ROOT = '/api/league';
    this.timeout(TIME_OUT);

    before(async () => {
        serve = new App();
        conn = await serve.express.listen();
        process.env.DB_CONNECTION_STRING = await mongoUnit.start();
    });

    before(async () => {
        const res = await chai.request(conn)
            .post('/api/user')
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            });
        userId = res.body._id;
        userId.length.should.equal(MongoDb.MONGO_ID_LEN);

    });

    after(async () => {
        await mongoUnit.drop();
        await mongoUnit.stop();
    });

    it('Should succeed and return an array with 1 element', async () => {
        const res = await chai.request(conn)
            .get('/api/user' + '/all');
        res.body.should.be.a('array');
        res.body.length.should.equal(1);

    });

    it('it should Create a league object', async () => {
        const league = {Name: 'league', Owner: userId, Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
        leagueId = res.body._id;
        leagueName = res.body.Name;
    });

    it('it should Fail on no owner', async () => {
        const league = {Name: 'league', Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail on no game_type', async () => {
        const league = {Name: 'league', Owner: userId, Description: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail on no Desc.', async () => {
        const league = {Name: 'league', Owner: userId, Game_type: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail on duplicate name', async () => {
        const league = {Name: 'league', Owner: userId, Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail on bad owner', async () => {
        const league = {Name: 'league2', Owner: '000000000000000000000000', Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Get a league by id', async () => {
        const res = await chai.request(conn)
            .get(LEAGUE_ROOT)
            .query({id: leagueId});
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });

    it('it should fail to get a league with no id', async () => {
        const res = await chai.request(conn)
            .get(LEAGUE_ROOT);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail, try to get a league with bad id', async () => {
        const res = await chai.request(conn)
            .get(LEAGUE_ROOT)
            .query({id: '000000000000000000000000'});
        res.status.should.equal(HttpStatus.NOT_FOUND);
        res.body.should.be.a('array');
    });

    it('it should Get a league by name', async () => {
        const res = await chai.request(conn)
            .get(LEAGUE_ROOT)
            .query({name: leagueName});
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });

    it('it should Fail try to get a league with bad name', async () => {
        const res = await chai.request(conn)
            .get(LEAGUE_ROOT)
            .query({name: '000000000000000000000000'});
        res.status.should.equal(HttpStatus.NOT_FOUND);
        res.body.should.be.a('array');
    });

    it('it should Get all Leagues', async function() {
        const res = await chai.request(conn)
            .get(LEAGUE_ROOT + '/all');
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
    });

    it('it should Update a league object new name', async () => {
        const league = {Name: 'leagueNew'};
        const res = await chai.request(conn)
            .put(LEAGUE_ROOT)
            .query({id: leagueId})
            .send(league);
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
        res.body.Name.should.equal('leagueNew');
        res.body.Owner.should.equal(userId);
    });

    it('it should Fail no id specified for update', async () => {
        const league = {Name: 'leagueNew', Owner: userId, Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .put(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail bad id specified for update', async () => {
        const league = {Name: 'leagueNew', Owner: userId, Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .put(LEAGUE_ROOT)
            .query({id: '000000000000000000000000'})
            .send(league);
        res.status.should.equal(HttpStatus.NOT_FOUND);
        res.body.should.be.a('object');
    });

    it('it should Delete a league by id', async () => {
        const res = await chai.request(conn)
            .delete(LEAGUE_ROOT)
            .query({id: leagueId});
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });

    it('it should Fail to Delete on no league id', async () => {
        const res = await chai.request(conn)
            .delete(LEAGUE_ROOT);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Fail to Delete on bad league id', async () => {
        const res = await chai.request(conn)
            .delete(LEAGUE_ROOT)
            .query({id: '000000000000000000000000'});
        res.status.should.equal(HttpStatus.NOT_FOUND);
        res.body.should.be.a('object');
    });
});

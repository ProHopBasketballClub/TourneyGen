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

describe('Team Controller', async function() {
    let userId: string = '';
    let serve; // A variable for the node app
    let conn; // The variable for the connection to the server
    const TIME_OUT: number = 20000;
    const TEAM_ROOT = '/api/team';
    let teamId: string = '';
    let teamName: string = '';
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

    it('it should Create a team object', async () => {
        const team = {Name: 'bois', Owner: userId, Roster: ['R4'], Description: 'Yes'};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
        teamId = res.body._id;
        teamName = res.body.Name;
    });

    it('it should fail to create a team object on empty roster', async () => {
        const team = {Name: 'bois2', Owner: userId, Roster: [''], Description: 'Yes'};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });
    it('it should fail to create a team object on empty body', async () => {
        const res = await chai.request(conn)
            .post(TEAM_ROOT);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to create a team object on no roster', async () => {
        const team = {Name: 'bois2', Owner: userId, Description: 'Yes'};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to create a team object on no description', async () => {
        const team = {Name: 'bois2', Owner: userId, Roster: ['Name']};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to create a team object on empty description', async () => {
        const team = {Name: 'bois2', Owner: userId, Roster: ['R4'], Description: ''};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to create a team object on existing name', async () => {
        const team = {Name: 'bois', Owner: userId, Roster: ['R4'], Description: 'Desc'};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to create a team object on no name', async () => {
        const team = {Owner: userId, Roster: ['R4'], Description: 'Desc'};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');

    });

    it('it should fail to create a team object on empty name', async () => {
        const team = {Name: '', Owner: userId, Roster: ['R4'], Description: 'Desc'};
        const res = await chai.request(conn)
            .post(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should Update a team object', async () => {
        const team = {Name: 'bois2', Owner: userId, Roster: ['R5'], Description: 'Yess'};
        const res = await chai.request(conn)
            .put(TEAM_ROOT)
            .query({id: teamId})
            .send(team);
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
        teamName = res.body.Name;
    });

    it('it should fail to update a team object no id', async () => {
        const team = {Name: 'bois2', Owner: userId, Roster: ['R5'], Description: 'Yess'};
        const res = await chai.request(conn)
            .put(TEAM_ROOT)
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to Update a team object bad id', async () => {
        const team = {Name: 'bois2', Owner: '000000000000000000000000', Roster: ['R5'], Description: 'Yess'};
        const res = await chai.request(conn)
            .put(TEAM_ROOT)
            .query({id: teamId})
            .send(team);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });
    it('it should fail to Update a team object on empty body', async () => {
        const res = await chai.request(conn)
            .put(TEAM_ROOT)
            .query({id: teamId});
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });
    it('it should Get an object by id', async () => {
        const res = await chai.request(conn)
            .get(TEAM_ROOT)
            .query({id: teamId});
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });
    it('it should Get an object by name', async () => {
        const res = await chai.request(conn)
            .get(TEAM_ROOT)
            .query({name: teamName});
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });
    it('it should fail to get a team no identifier', async () => {
        const res = await chai.request(conn)
            .get(TEAM_ROOT);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });
    it('it should fail to get a team bad id', async () => {
        const res = await chai.request(conn)
            .get(TEAM_ROOT)
            .query({id:'bad id'});
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });
    it('it should fail to Delete a team bad id', async () => {
        const res = await chai.request(conn)
            .delete(TEAM_ROOT)
            .query({id:'bad id'});
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });
    it('it should fail to Delete a team no id', async () => {
        const res = await chai.request(conn)
            .delete(TEAM_ROOT);
        res.status.should.equal(HttpStatus.BAD_REQUEST);
        res.body.should.be.a('object');
    });

    it('it should fail to Delete a team not found', async () => {
        const res = await chai.request(conn)
            .delete(TEAM_ROOT)
            .query({id:'000000000000000000000000'});
        res.status.should.equal(HttpStatus.NOT_FOUND);
        res.body.should.be.a('object');
    });
    it('it should fail to Delete a team', async () => {
        const res = await chai.request(conn)
            .delete(TEAM_ROOT)
            .query({id:teamId});
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });
});

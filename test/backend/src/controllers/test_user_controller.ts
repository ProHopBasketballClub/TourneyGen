import * as HttpStatus from 'http-status-codes';
import * as mongoUnit from 'mongo-unit';
import {App} from '../../../../web/backend/src/app';
import {MongoDb} from '../../../../web/backend/src/db';

// The root of the user api
const USER_ROOT: string = '/api/user';

// No ec6 import exists for these packages import must be done this way
// tslint:disable-next-line:no-var-requires
const chai = require('chai');
// tslint:disable-next-line:no-var-requires
const chaiHttp = require('chai-http');

// Set up the tests for http requests
chai.use(chaiHttp);
chai.should();

// This tests examines what happens if an empty database is queried for all users
// Expects an empty array
describe('User Controller tests', async function() {
    let userId: string = '';
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

    after(async () => {
        await mongoUnit.drop();
        await mongoUnit.stop();
    });

    it('it should GET an empty array', async () => {
        const res = await chai.request(conn)
            .get(USER_ROOT + '/all');

        res.should.have.status(HttpStatus.OK);
        res.body.should.be.a('array');
        res.body.length.should.be.equal(0);

    });

// This test examines what happens if the user endpoint is queried with no id or display Name
// Expects 400 error and error string
    it('it should GET user return 400 error', async () => {
        const res = await chai.request(conn)
            .get(USER_ROOT);
        res.should.have.status(HttpStatus.BAD_REQUEST);
    });

// Attempts to create a user
// Expects to succeed
    it('it should create a user in the database', async () => {
        const res = await chai.request(conn)
            .post(USER_ROOT)
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            });

        res.should.have.status(HttpStatus.OK);
        res.body.displayName.should.equal('eetar2');
        res.body.email.should.equal('a@b.ca');
        userId = res.body._id;
    });

// Attempts to create a user with a duplicate display name
// Expects a 400 error and an error string
    it('it should error and say name exists', async () => {
        const res = await chai.request(conn)
            .post(USER_ROOT)
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            });

        res.should.have.status(HttpStatus.BAD_REQUEST);
    });

// Attempts to update a user with object
// Expect to succeed and update user name
    it('it should update user and succeed', async () => {
        const res = await chai.request(conn)
            .put(USER_ROOT)
            .query({id: userId})
            .send({
                displayName: 'eetar23',
                email: 'a@b.ca',
            });
        res.should.have.status(HttpStatus.OK);
        res.body.displayName.should.equal('eetar23');
    });
// This Attempts to update a user with a malformed id
// Expects a 400 error and a error string
    it('it should error on a bad id', async () => {
        const res = await chai.request(conn)
            .put(USER_ROOT)
            .query({id: 'Bad ID'})
            .send({
                displayName: 'eetar23',
                email: 'a@b.ca',
            });

        res.should.have.status(HttpStatus.BAD_REQUEST);
    });

// This attempts to update a user with an invalid user object
// Expects a 400 error and a error string
    it('it should error on a invalid user', async () => {
        const res = await chai.request(conn)
            .put(USER_ROOT)
            .query({id: userId})
            .send({
                email: 'a@b.ca',
            });
        res.should.have.status(HttpStatus.BAD_REQUEST);
    });

// Attempts to update a user that does not exist
// Expects an 400 error and a error string
    it('it should error with no user with id 0', async () => {
        const res = await chai.request(conn)
            .put(USER_ROOT)
            .query({id: '000000000000000000000000'})
            .send({
                displayName: 'eetar23',
                email: 'a@b.ca',
            });
        res.should.have.status(HttpStatus.NOT_FOUND);
    });

// Attempts to get a user by display name
// Expects a User objects an a 200
    it('it should GET user return 200', async () => {
        const res = await chai.request(conn)
            .get(USER_ROOT)
            .query({displayName: 'eetar23'});

        res.should.have.status(HttpStatus.OK);
        res.body.displayName.should.equal('eetar23');
    });

// Attempts to get a user by id
// Expects a User objects an a 200
    it('it should GET user return 200', async () => {
        const res = await chai.request(conn)
            .get(USER_ROOT)
            .query({id: userId});

        res.should.have.status(HttpStatus.OK);
        res.body._id.should.equal(userId);
    });

// Gets all of the users in the database
// Expects array of length one
    it('it should GET an  array of length 1', async () => {
        const res = await chai.request(conn)
            .get(USER_ROOT + '/all');

        res.should.have.status(HttpStatus.OK);
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
    });

// Attempts to delete a user with no id
// Expects 400 and error string
    it('it should error and say id required', async () => {
        const res = await chai.request(conn)
            .delete(USER_ROOT);
        res.should.have.status(HttpStatus.BAD_REQUEST);
    });

// Attempts to delete a user with invalid id
// Expects 200 and success message
    it('it should error and say id required', async () => {
        const res = await chai.request(conn)
            .delete(USER_ROOT)
            .query({id: '000000000000000000000000'});
        res.should.have.status(HttpStatus.NOT_FOUND);
    });

// Attempts to delete a user by id
// Expects 200 and success message
    it('it should Delete user return 200', async () => {
        const res = await chai.request(conn)
            .delete(USER_ROOT)
            .query({id: userId});
        res.should.have.status(HttpStatus.OK);
    });
});

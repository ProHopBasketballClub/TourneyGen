import {request, should, expect, use} from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
// Configures Chai to use requests and sets up the assertions
use(chaiHttp);
should();

// The basis of all the apis
const API_ROOT: string = 'http://172.28.1.1:34345';
let userId: string = '';
// The root of the user api
const USER_ROOT: string = '/api/user';

describe('/api/user/all /GET All user', () => {
    it('it should GET an empty array', (done) => {
        request(API_ROOT)
            .get(USER_ROOT + '/all')
            .end((err, res) => {
                // tslint:disable-next-line:no-magic-numbers
                res.should.have.status(HttpStatus.OK);
                res.body.should.be.a('array');
                expect(res.body.length).to.equal(0);
                done();
            });
    });
});

describe('/api/user /GET A user', () => {
    it('it should GET user return 400 error', (done) => {
        request(API_ROOT)
            .get(USER_ROOT)
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                res.body.error.should.equal('Invalid request id or displayName required');
                done();
            });
    });
});

describe('/api/user /POST Create a user', () => {
    it('it should create a user in the database', (done) => {
        request(API_ROOT)
            .post(USER_ROOT)
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            })
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.displayName.should.equal('eetar2');
                res.body.email.should.equal('a@b.ca');
                userId = res.body._id;
                done();
            });
    });
});

describe('/api/user /POST Create a user but display name exists', () => {
    it('it should error and say name exists', (done) => {
        request(API_ROOT)
            .post(USER_ROOT)
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            })
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                res.body.error.should.equal('A user already has this user name please choose a different one');
                done();
            });
    });
});

describe('/api/user /POST Update an existing user', () => {
    it('it should update and succeed', (done) => {
        request(API_ROOT)
            .put(USER_ROOT)
            .query({id: userId})
            .send({
                displayName: 'eetar23',
                email: 'a@b.ca',
            })
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.displayName.should.equal('eetar23');
                done();
            });
    });
});

describe('/api/user /POST Update an existing user', () => {
    it('it should error on a bad id', (done) => {
        request(API_ROOT)
            .put(USER_ROOT)
            .query({id: 'Bad ID'})
            .send({
                displayName: 'eetar23',
                email: 'a@b.ca',
            })
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                res.body.error.should.equal('The id parameter is malformed');
                done();
            });
    });
});

describe('/api/user /POST Update an existing user', () => {
    it('it should error on a invalid user', (done) => {
        request(API_ROOT)
            .put(USER_ROOT)
            .query({id: userId})
            .send({
                email: 'a@b.ca',
            })
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                res.body.error.should.equal('Display name must be at least 4 long and an id must be a param');
                done();
            });
    });
});

describe('/api/user /POST Update an existing user', () => {
    it('it should error with no user with id 0', (done) => {
        request(API_ROOT)
            .put(USER_ROOT)
            .query({id: '000000000000000000000000'})
            .send({
                displayName: 'eetar23',
                email: 'a@b.ca',
            })
            .end((err, res) => {
                res.should.have.status(HttpStatus.NOT_FOUND);
                res.body.error.should.equal('You cannot update a user that does not exist');
                done();
            });
    });
});


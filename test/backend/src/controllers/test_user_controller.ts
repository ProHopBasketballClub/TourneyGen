import {expect, request, should, use} from 'chai';
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

// This tests examines what happens if an empty database is queried for all users
// Expects an empty array
describe('/api/user/all /GET All user', () => {
    it('it should GET an empty array', (done) => {
        request(API_ROOT)
            .get(USER_ROOT + '/all')
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.should.be.a('array');
                expect(res.body.length).to.equal(0);
                done();
            });
    });
});

// This test examines what happens if the user endpoint is queried with no id or display Name
// Expects 400 error and error string
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

// Attempts to create a user
// Expects to succeed
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

// Attempts to create a user with a duplicate display name
// Expects a 400 error and an error string
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

// Attempts to update a user with object
// Expect to succeed and update user name
describe('/api/user /POST Update an existing user', () => {
    it('it should update user and succeed', (done) => {
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
// This Attempts to update a user with a malformed id
// Expects a 400 error and a error string
describe('/api/user /POST Update an existing user Fail', () => {
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

// This attempts to update a user with an invalid user object
// Expects a 400 error and a error string
describe('/api/user /POST Update an existing user Fail', () => {
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

// Attempts to update a user that does not exist
// Expects an 400 error and a error string
describe('/api/user /POST Update user that does not exist', () => {
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

// Attempts to get a user by display name
// Expects a User objects an a 200
describe('/api/user /GET A user by display Name', () => {
    it('it should GET user return 200', (done) => {
        request(API_ROOT)
            .get(USER_ROOT)
            .query({displayName: 'eetar23'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.displayName.should.equal('eetar23');
                done();
            });
    });
});

// Attempts to get a user by id
// Expects a User objects an a 200
describe('/api/user /GET A user by id', () => {
    it('it should GET user return 200', (done) => {
        request(API_ROOT)
            .get(USER_ROOT)
            .query({id: userId})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body._id.should.equal(userId);
                done();
            });
    });
});

// Gets all of the users in the database
// Expects array of length one
describe('/api/user/all /GET All user', () => {
    it('it should GET an  array of length 1', (done) => {
        request(API_ROOT)
            .get(USER_ROOT + '/all')
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.should.be.a('array');
                expect(res.body.length).to.above(0);
                done();
            });
    });
});

// Attempts to delete a user with no id
// Expects 400 and error string
describe('/api/user /Delete A user object with no id Fail', () => {
    it('it should error and say id required', (done) => {
        request(API_ROOT)
            .delete(USER_ROOT)
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Attempts to delete a user with invalid id
// Expects 200 and success message
describe('/api/user /Delete A user object with bad id Fail', () => {
    it('it should error and say id required', (done) => {
        request(API_ROOT)
            .delete(USER_ROOT)
            .query({id: '000000000000000000000000'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.NOT_FOUND);
                done();
            });
    });
});

// Attempts to delete a user by id
// Expects 200 and success message
describe('/api/user /Delete A user object', () => {
    it('it should Delete user return 200', (done) => {
        request(API_ROOT)
            .delete(USER_ROOT)
            .query({id: userId})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                done();
            });
    });
});

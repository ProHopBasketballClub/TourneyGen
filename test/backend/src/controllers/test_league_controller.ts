import {expect, request, should, use} from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import {MongoDb} from '../../../../web/backend/src/db/mongo.db';

// Configures Chai to use requests and sets up the assertions
use(chaiHttp);
should();

// The basis of all the apis
const API_ROOT: string = 'http://172.28.1.1:34345';
let leagueId: string = '';
let userId: string = '';
// The root of the user api
const LEAGUE_ROOT: string = '/api/league';

/*
Summary of tests

Test 1) Happy path of creating a league
Test 2) Try to create a league with no owner
Test 3) Try to create a league with no game_type
Test 4) Try to create a league with no desc.
Test 5) Try to create a league with a bad user id
Test 6) Try to get league specified by id
Test 7) Try to get league with no id
Test 8) Try to get league with a bad id
Test 9) Try to get league by name
Test 10) Try to get league with a bad name
Test 11) Try to get all leagues
Test 12) Try to update league with new name
Test 13) Try to update league with no id
Test 14) Try to update league with bad id
Test 15) Try to delete league
Test 16) Try to delete league with no id
Test 17) Try to delete league with bad id
 */

// Create a user in the database to be Owner
// The done parameter and function act as awaits to force the function to fully run before advancing
before(function(done) {
    request(API_ROOT)
        .post('/api/user')
        .send({
            displayName: 'eetar2',
            email: 'a@b.ca',
        })
        .end((err, res) => {
            userId = res.body._id;
            done();
        });
});

// Delete the user after the tests
after(function(done) {
    request(API_ROOT)
        .delete('/api/user')
        .query({id: userId})
        .end((err, res) => {
            userId = res.body._id;
            done();
        });
});

// Create a league in the database
// Expect success and a league object returned
describe('/api/league /Post Create a League', () => {
    it('it should Create a league object', function(done) {
        request(API_ROOT)
            .post(LEAGUE_ROOT)
            .send({Name: 'league', Owner: userId, Game_type: 'R4', Description: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body._id.length.should.equal(MongoDb.MONGO_ID_LEN);
                leagueId = res.body._id;
                done();
            });
    });
});

// Try to create an invalid league object
// Expect fail with error string
describe('/api/league /Post send bad league object', () => {
    it('no league owner should reject', function(done) {
        request(API_ROOT)
            .post(LEAGUE_ROOT)
            .send({Name: 'league', Game_type: 'R4', Description: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to create an invalid league object
// Expect fail with error string
describe('/api/league /Post send bad league object', () => {
    it('no game type should reject', function(done) {
        request(API_ROOT)
            .post(LEAGUE_ROOT)
            .send({Name: 'league', Owner: userId, Description: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to create an invalid league object
// Expect fail with error string
describe('/api/league /Post send bad league object', () => {
    it('no description should reject', function(done) {
        request(API_ROOT)
            .post(LEAGUE_ROOT)
            .send({Name: 'league', Owner: userId, Game_type: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to create an invalid league object
// Expect fail with error string
describe('/api/league /Post send bad league object', () => {
    it('not valid owner should reject', function(done) {
        request(API_ROOT)
            .post(LEAGUE_ROOT)
            .send({Name: 'league', Owner: '000000000000000000000000', Game_type: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to find a user by id
// Expect to pass and return matching id
describe('/api/league /Get get league with id', () => {
    it('Should succeed and return a matching id', function(done) {
        request(API_ROOT)
            .get(LEAGUE_ROOT)
            .query({id: leagueId})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body._id.should.equal(leagueId);
                done();
            });
    });
});

// Try to find a user by id
// Expect to fail and return error string
describe('/api/league /Get get league with id', () => {
    it('Should fail no id specified', function(done) {
        request(API_ROOT)
            .get(LEAGUE_ROOT)
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to find a user by id
// Expect to fail and return error string
describe('/api/league /Get get league with id', () => {
    it('Should fail no league found', function(done) {
        request(API_ROOT)
            .get(LEAGUE_ROOT)
            .query({id: '000000000000000000000000'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.NOT_FOUND);
                done();
            });
    });
});

// Try to find a user by name
// Expect to pass and return league
describe('/api/league /Get get league with name', () => {
    it('Should pass and return league', function(done) {
        request(API_ROOT)
            .get(LEAGUE_ROOT)
            .query({name: 'league'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                done();
            });
    });
});

// Try to find a user by name
// Expect to fail and return empty array
describe('/api/league /Get get league with name', () => {
    it('Should fail and return empty array', function(done) {
        request(API_ROOT)
            .get(LEAGUE_ROOT)
            .query({name: 'not league'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.NOT_FOUND);
                res.body.should.be.a('array');
                res.body.length.should.equal(0);
                done();
            });
    });
});

// Try to get all of the leagues
// Should return an array of length 1
describe('/api/league/all /Get Get all leagues', () => {
    it('Should succeed and return an array with 1 element', function(done) {
        request(API_ROOT)
            .get(LEAGUE_ROOT + '/all')
            .query({id: leagueId})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.should.be.a('array');
                res.body.length.should.equal(1);
                done();
            });
    });
});

// Try to update a league by id
// Should return a league with a new name
describe('/api/league /Put Update League', () => {
    it('Should succeed and return a league with name New Name', function(done) {
        request(API_ROOT)
            .put(LEAGUE_ROOT)
            .query({id: leagueId})
            .send({Name: 'New Name', Owner: userId, Game_type: 'R4', Description: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                res.body.Name.should.equal('New Name');
                done();
            });
    });
});

// Try to update a league by id
// Should fail and error string
describe('/api/league /Put Update League', () => {
    it('Should fail no league specified', function(done) {
        request(API_ROOT)
            .put(LEAGUE_ROOT)
            .send({Name: 'New Name', Owner: userId, Game_type: 'R4', Description: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to update a league by id
// Should fail and error string
describe('/api/league /Put Update League', () => {
    it('Should fail no league found', function(done) {
        request(API_ROOT)
            .put(LEAGUE_ROOT)
            .query({id: '000000000000000000000000'})
            .send({Name: 'New Name', Owner: userId, Game_type: 'R4', Description: 'Yes'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.NOT_FOUND);
                done();
            });
    });
});

// Try to delete a league by id
//  Should pass and remove league
describe('/api/league /Delete Delete a League', () => {
    it('it should Delete a league object', function(done) {
        request(API_ROOT)
            .delete(LEAGUE_ROOT)
            .query({id: leagueId})
            .end((err, res) => {
                res.should.have.status(HttpStatus.OK);
                done();
            });
    });
});

// Try to delete a league by id
//  Should fail and return error
describe('/api/league /Delete Delete a League', () => {
    it('should error no id specified', function(done) {
        request(API_ROOT)
            .delete(LEAGUE_ROOT)
            .end((err, res) => {
                res.should.have.status(HttpStatus.BAD_REQUEST);
                done();
            });
    });
});

// Try to delete a league by id
//  Should fail and return error
describe('/api/league /Delete Delete a League', () => {
    it('should error no league found', function(done) {
        request(API_ROOT)
            .delete(LEAGUE_ROOT)
            .query({id: '000000000000000000000000'})
            .end((err, res) => {
                res.should.have.status(HttpStatus.NOT_FOUND);
                done();
            });
    });
});

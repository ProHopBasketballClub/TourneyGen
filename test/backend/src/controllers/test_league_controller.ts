// import sinon
import * as HttpStatus from 'http-status-codes';
import {App} from '../../../../web/backend/src/app';

const chai = require('chai');

const chaiHttp = require('chai-http');

const prepare = require('mocha-prepare');
const mongoUnit = require('mongo-unit');

const sinon = require('sinon');
import {MongoDb} from '../../../../web/backend/src/db';

const LEAGUE_ROOT = '/api/league';

chai.use(chaiHttp);
chai.should();
let serve;
let conn;

let leagueId;
describe('getIndexPage', async function() {
    var userId: string = '';
    this.timeout(20000);

    before(async function() {
        serve = new App();
        conn = await serve.express.listen();
        process.env.DB_CONNECTION_STRING = await mongoUnit.start();
    });

    before(async function f() {
        let err, res = await chai.request(conn)
            .post('/api/user')
            .send({
                displayName: 'eetar2',
                email: 'a@b.ca',
            });
        userId = res.body._id;
        userId.length.should.equal(MongoDb.MONGO_ID_LEN);

    });

    after(async function f() {
        await serve.shutdown();
    });

    it('Should succeed and return an array with 1 element', async function() {
        let err, res = await chai.request(conn)
            .get('/api/user' + '/all');
        res.body.should.be.a('array');
        res.body.length.should.equal(1);

    });

    it('it should Create a league object', async function() {
        const league = {Name: 'league', Owner: userId, Game_type: 'R4', Description: 'Yes'};
        const res = await chai.request(conn)
            .post(LEAGUE_ROOT)
            .send(league);
        res.status.should.equal(HttpStatus.OK);
        res.body.should.be.a('object');
    });

});

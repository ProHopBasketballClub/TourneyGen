import {request, should,expect, use} from 'chai';
import chaiHttp = require('chai-http');
import {App} from '../../../../web/backend/src/app';

// Confgures Chai to use requests and sets up the assertions
use(chaiHttp);
should();

describe('/api/user/all /GET All user', () => {
    it('it should GET all the user', (done) => {
        // tslint:disable-next-line:no-magic-numbers
        const app = new App().express;
        request('http://172.28.1.1:34345')
            .get('/api/user/all')
            .end((err, res) => {
                // tslint:disable-next-line:no-magic-numbers
                res.should.have.status(200);
                res.body.should.be.a('array');
                expect(res.body.length).to.equal(0);
                done();
            });
    });
});


describe('/api/user /GET A user', () => {
    it('it should GET a user', (done) => {
        // tslint:disable-next-line:no-magic-numbers
        const app = new App().express;
        request('http://172.28.1.1:34345')
            .get('/api/user')
            .end((err, res) => {
                // tslint:disable-next-line:no-magic-numbers
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body.length).to.equal(0);
                done();
            });
    });
});

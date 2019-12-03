import * as mongoUnit from 'mongo-unit';

// tslint:disable-next-line:no-var-requires
const Mocha = require('mocha');
// tslint:disable-next-line:no-var-requires
const fs = require('fs');
// tslint:disable-next-line:no-var-requires
const path = require('path');
const files = ['test/backend/src/controllers/test_league_controller.js','test/backend/src/controllers/test_match_controller.js'];

mongoUnit.start().then(async (url) => {
    console.log('fake mongo is started: ', url);
    process.env.DB_CONNECTION_STRING = url;
    const mocha = new Mocha();
    const testDir = './';
    console.log( fs.readdirSync(testDir));
    mocha.addFile(files[0]);
    mocha.run(function(failures) {
        console.log(failures);
    });
}).catch(async (error) => {
    console.log(error);
    await mongoUnit.drop();
    await mongoUnit.stop();
});

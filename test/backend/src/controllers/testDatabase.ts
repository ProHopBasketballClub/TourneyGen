import * as mongoUnit from 'mongo-unit';

export class TestDatabase {
    public static async start() {
        await mongoUnit.start().then(async (url) => {
            console.log('fake mongo is started: ', url);
            process.env.DB_CONNECTION_STRING = url;
        }).catch(async (error) => {
            console.log(error);
            await mongoUnit.drop();
            await mongoUnit.stop();
        });
    }
}

import * as mongoUnit from 'mongo-unit';

export class TestDatabase {
    public static async start() {
        try {
            process.env.DB_CONNECTION_STRING = await mongoUnit.start();
            console.log(process.env.DB_CONNECTION_STRING);
        } catch (e) {
            console.log(e);
        }
    }
}

import {Db, MongoClient} from 'mongodb';


export class MongoDb {
    private client: MongoClient
    private connectionString: String = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017';
    private dbName = 'test';

    public close() {
        if (this.client) {
            this.client.close()
                .then()
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.error('close: client is undefined');
        }
    }


    public async connect() {
        try {
            if (!this.client) {
                console.info(`Connectiong to ${this.connectionString}`);
                this.client = await MongoClient.connect(this.connectionString, {'useNewUrlParser': true});
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * gets the todo db from mongo
     *
     */
    public getDb(): Db {
        if (this.client) {
            console.info(`getting db ${this.dbName}`);

            return this.client.db(this.dbName);
        } else {
            console.error('no db found');

            return undefined;
        }
    }
}
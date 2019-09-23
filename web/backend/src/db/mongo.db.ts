import {Db, MongoClient} from 'mongodb';
import * as HttpStatus from "http-status-codes";


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

    public static async save(col: String, record) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(col);
        await collection.insertOne(record);
        mongo.close()
    }

    public static async getOne(col: String, id: String) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        db.collection(col, (error, collection) => {
            if (error) {
                throw new Error(error)
            }
            var out = collection
                .findOne({_id: id});
            mongo.close();
            return out;
        });
    }

    public static async getBy(table: String, col: String, param: String,) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        db.collection(table, (error, collection) => {
            if (error) {
                throw new Error(error)
            }
            collection.find({col: param})
                .toArray((arrayError, result) => {
                    if (arrayError) {
                        throw new Error('Array Error Encountered')
                    }
                    return result;
                });
        });
    }

    public static async getAll(col: String) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        var out;
        db.collection(col, (error, collection) => {
            if (error) {
                return;
            }

            collection
                .find()
                .toArray((arrayError, result) => {
                    if (arrayError) {
                    }
                    out = JSON.stringify(result);
                });
        });
        console.log(out + "funct")
        return out;
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
import {Db, MongoClient,ObjectId,Collection} from 'mongodb';
import * as HttpStatus from "http-status-codes";
import {User} from "../models";


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
        const db:Db = mongo.getDb();
        const collection:Collection = db.collection(col);
        try {
            await collection.insertOne(record);
        }
        catch (e) {
            console.log(e)
        }
        mongo.close()
    }

    public static async updateById(table:string,record,id:string) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(table);
        try {
            await collection.updateOne({_id: new ObjectId(id)}, {$set:record}, {upsert: false});
        }
        catch (e) {
            console.log(e);
        }
        mongo.close()
    }

    public static async getById(col: String, id: String) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(col);
        var out;
        try {
            out = collection.findOne({_id: new ObjectId(id)});
        }
        catch (e) {
            console.log(e);
        }
        await mongo.close();
        return out;
    }

    public static async getByDisplayname(col: String, name: String) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(col);
        var out;
        try {
             out = collection.findOne({displayName: name});
        }
        catch (e) {
            console.log(e);
            out = e;
        }
        await mongo.close();
        return out;
    }


    public static async getAll(col: String): Promise<string> {
        console.log('getall');
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(col);
        var out;
        try {
             out = collection.find().toArray();
        }
        catch (e) {
            console.log(e);
        }
        await mongo.close();
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
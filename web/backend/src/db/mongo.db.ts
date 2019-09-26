import {Collection, Db, MongoClient, ObjectId} from 'mongodb';

export class MongoDb {

    // saves a single record of any type into a specified table/collection
    public static async save(col: string, record: any): Promise<boolean> {
        const mongo: MongoDb = new MongoDb();
        await mongo.connect();
        const db: Db = mongo.getDb();
        const collection: Collection = db.collection(col);
        try {
            await collection.insertOne(record);
        } catch (e) {
            console.log(e);
            return false;
        }
        mongo.close();
        return true;
    }

    // updates a single record identified by id in a specified table
    public static async updateById(table: string, record, id: string): Promise<boolean> {
        const mongo: MongoDb = new MongoDb();
        await mongo.connect();
        const db: Db = mongo.getDb();
        const collection: Collection = db.collection(table);
        try {
            await collection.updateOne({_id: new ObjectId(id)}, {$set: record}, {upsert: false});
        } catch (e) {
            console.log(e);
            return false;
        }
        mongo.close();
        return true;
    }

    // returns a single record that has been found in a specified table identified by an id
    public static async getById(col: string, id: string): Promise<any> {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(col);
        let out;
        try {
            out = collection.findOne({_id: new ObjectId(id)});
        } catch (e) {
            console.log(e);
        }
        await mongo.close();
        return out;
    }

    // user specific query for getting users identified by displayName
    public static async getByDisplayName(col: string, name: string) {
        const mongo = new MongoDb();
        await mongo.connect();
        const db = mongo.getDb();
        const collection = db.collection(col);
        let out;
        try {
            out = collection.findOne({displayName: name});
        } catch (e) {
            console.log(e);
            out = e;
        }
        await mongo.close();
        return out;
    }

    // returns all of the documents saved to a table/collection
    public static async getAll(col: string): Promise<any> {
        const mongo: MongoDb = new MongoDb();
        await mongo.connect();
        const db: Db = mongo.getDb();
        const collection: Collection = db.collection(col);
        let out;
        try {
            out = collection.find().toArray();
        } catch (e) {
            console.log(e);
        }
        await mongo.close();
        return out;
    }

    // deletes a single object identified by an id
    public static async deleteById(table: string, id: string): Promise<boolean> {
        const mongo: MongoDb = new MongoDb();
        await mongo.connect();
        const db: Db = mongo.getDb();
        const collection: Collection = db.collection(table);
        try {
            await collection.remove({_id: new ObjectId(id)});
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

    private client: MongoClient;
    private connectionstring: string = process.env.DB_CONNECTION_STRING;
    private dbName = 'test';

    public close() {
        if (this.client) {
            this.client.close()
                .then()
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error('close: client is undefined');
        }
    }

    public async connect() {
        try {
            if (!this.client) {
                console.info(`Connectiong to ${this.connectionstring}`);
                this.client = await MongoClient.connect(this.connectionstring, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
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

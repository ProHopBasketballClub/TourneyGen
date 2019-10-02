import {Collection, Db, MongoClient, ObjectId} from 'mongodb';

export class MongoDb {

    public static async save(table: string, record: any): Promise<boolean> {
        return await this._boolean_operation(table, [record], this._save);
    }

    public static async updateById(table: string, id: string, record: any): Promise<boolean> {
        return await this._boolean_operation(table, [record, id], this._updateById);
    }

    public static async getById(table: string, id: string) {
        return await this._get_operation(table, [id], this._getById);
    }

    public static async getByDisplayName(table: string, name: string) {
        return await this._get_operation(table, [name], this._getByDisplayName);
    }

    public static async getAll(table: string) {
        try {
            return await this._get_operation(table, [], this._getAll);
        } catch (e) {
            console.log(e);
        }
    }

    public static async deleteById(table: string, id: string): Promise<boolean> {
        return await this._boolean_operation(table, [id], this._deleteById);
    }

    // Function for mongo connection that return a boolean and performs a task
    private static async _boolean_operation(table: string, operation_args: any[], operation: (...args: any[]) => void): Promise<boolean> {
        const mongo: MongoDb = new MongoDb();
        await mongo.connect();
        const db: Db = mongo.getDb();
        const collection: Collection = db.collection(table);
        operation_args.push(collection);
        try {
            await operation(...operation_args);
        } catch (e) {
            console.log(e);
            return false;
        }
        mongo.close();
        return true;
    }

    /// This function connect to mongo and performs a retrieves and return a dictionary of valid and data
    // if the return is not valid the data contains the error
    private static async _get_operation(table: string, operation_args: any[], operation: (...args: any[])=>object): Promise<any> {
        const mongo: MongoDb = new MongoDb();
        try {
            await mongo.connect();
            const db: Db = mongo.getDb();
            const collection: Collection = db.collection(table);
            operation_args.push(collection);
        } catch (e) {
            console.log(e);
        }

        let out: any;
        try {
            out = await operation(...operation_args);
            console.log(out);
        } catch (e) {
            console.log(e);
            mongo.close();
            return {valid: false, data: e};

        }
        mongo.close();
        return {valid: true, data: out};
    }

    // saves a single record of any type into a specified table/collection
    private static async _save(record: any, collection: Collection): Promise<void> {
        await collection.insertOne(record);
    }

    // updates a single record identified by id in a specified table
    private static async _updateById(record: any, id: string, collection: Collection): Promise<void> {
        await collection.updateOne({_id: new ObjectId(id)}, {$set: record}, {upsert: false});
    }

    // returns a single record that has been found in a specified table identified by an id
    private static async _getById(id: string, collection: Collection): Promise<any> {
        return await collection.findOne({_id: new ObjectId(id)});

    }

    // user specific query for getting users identified by displayName
    private static async _getByDisplayName(name: string, collection: Collection) {
        return await collection.findOne({displayName: name});
    }

    // returns all of the documents saved to a table/collection
    private static async _getAll(collection: Collection): Promise<any> {
        return collection.find().toArray();
    }

    // deletes a single object identified by an id
    private static async _deleteById(id: string, collection: Collection): Promise<void> {
        await collection.remove({_id: new ObjectId(id)});
    }

    // The mongo driver
    private client: MongoClient;
    // This is passed in the compose file and should be the auto generated mongo URI
    private connectionString: string = process.env.DB_CONNECTION_STRING;

    private dbName = 'tourneyData';

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
                console.info(`Connecting to ${this.connectionString}`);
                this.client = await MongoClient.connect(this.connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

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

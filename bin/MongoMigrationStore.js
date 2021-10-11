const { MongoClient } = require('mongodb');

const COLLECTION = 'dbmigrations';

module.exports = class MongoMigrationStore {
  constructor() {
    this.url = process.env.MONGO_URL;
  }

  async connect() {
    this.mongoClient = new MongoClient(this.url, {});
    await this.mongoClient.connect();
    this.db = this.mongoClient.db();
  }

  async load(callback) {
    await this.connect();
    const data = await this.db.collection(COLLECTION).findOne({});
    if (!data) {
      return callback(null, {});
    }

    if (!data.hasOwnProperty('lastRun') || !data.hasOwnProperty('migrations')) {
      return callback(new Error('Invalid migration data'));
    }

    return callback(null, data);
  }

  async save(set, callback) {
    await this.connect();
    this.db
      .collection(COLLECTION)
      .updateOne(
        {},
        {
          $set: {
            lastRun: set.lastRun,
          },
          $push: {
            migrations: { $each: set.migrations },
          },
        },
        {
          upsert: true,
        },
      )
      .then((result) => {
        callback(null, result);
      })
      .catch((e) => {
        callback(e);
      });
  }
};

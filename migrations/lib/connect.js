const { MongoClient } = require('mongodb');

module.exports = async function connect() {
  const client = new MongoClient(process.env.MONGO_URL || process.env.MONGO_URL, {});
  await client.connect();
  return client.db();
};

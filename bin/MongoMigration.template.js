/**
 * [BAM-####](https://bambee.atlassian.net/browse/BAM-####)
 *
 * Description Here
 */
const { MongoClient } = require('mongodb');
async function connect() {
  const client = new MongoClient(process.env.MONGO_URL || process.env.MONGODB_URL);
  await client.connect();
  return client.db();
}

module.exports.description = 'Your Description Here';

module.exports.up = async function (next) {
  const db = await connect();

  // perform your migration here
};

module.exports.down = async function (next) {
  const db = await connect();
  // perform your un-migration here
};

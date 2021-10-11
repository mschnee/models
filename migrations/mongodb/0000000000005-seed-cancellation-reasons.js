const connect = require('../lib/connect');
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

module.exports.description = 'Adds configuration for cancellation reasons';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Running 0000000000005-seed-cancellation-reasons');
  const db = await connect();
  await db.collection('configurations').insertOne({
    name: 'CancellationReasons',
    kind: 'CancellationReasons',
    groups: require('../mongodb-data/5-cancellation-reasons.json'),
  });
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Revert 0000000000005-seed-cancellation-reasons');
  const db = await connect();
  await db.collection('configurations').deleteOne({
    name: 'CancellationReasons',
  });
};

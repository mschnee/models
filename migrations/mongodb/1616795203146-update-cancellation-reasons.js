const connect = require('../lib/connect');
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

module.exports.description = 'Update cancellation reasons';

module.exports.up = async function () {
  log('Running 1616795203146-update-cancellation-reasons');
  const db = await connect();
  await db.collection('configurations').updateOne(
    {
      kind: 'CancellationReasons',
    },
    {
      $rename: {
        groups: 'groups-previous',
      },
    },
  );
  await db.collection('configurations').updateOne(
    {
      kind: 'CancellationReasons',
    },
    {
      $set: {
        groups: require('../mongodb-data/8-cancellation-reasons.json'),
      },
    },
  );
};

module.exports.down = async function () {
  log('Revert 1616795203146-update-cancellation-reasons');
  const db = await connect();
  await db.collection('configurations').updateOne(
    {
      kind: 'CancellationReasons',
    },
    {
      $rename: {
        'groups-previous': 'groups',
      },
    },
  );
};

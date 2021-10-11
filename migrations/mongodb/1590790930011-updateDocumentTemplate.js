const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');
const connect = require('../lib/connect');

module.exports.description = "Adds type to document templates, and defaults to 'bambee'";

module.exports.up = async function () {
  log('Running 1590790930011-updateDocumentTemplate');
  const db = await connect();
  await db
    .collection('documenttemplates')
    .updateMany({ $or: [{ type: { $exists: false } }, { type: null }] }, { $set: { type: 'bambee' } });
};

module.exports.down = async function () {
  log('Reverting 1590790930011-updateDocumentTemplate');
  const db = await connect();
  await db.collection('documenttemplates').updateMany({}, { $unset: { type: true } });
};

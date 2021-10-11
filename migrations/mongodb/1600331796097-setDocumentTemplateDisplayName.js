/**
 * [BAM-6835](https://bambee.atlassian.net/browse/BAM-6835)
 */
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');
const connect = require('../lib/connect');

module.exports.description = 'Adds displayName to document templates copying content from name field';

module.exports.up = async function () {
  log('Running 1600331796097-setDocumentTemplateDisplayName');
  const db = await connect();
  const operations = [];

  const cursor = db.collection('documenttemplates').find({
    displayName: { $exists: false },
  });
  while (await cursor.hasNext()) {
    const doc = await cursor.next();

    operations.push({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            displayName: doc.name,
          },
        },
      },
    });
  }
  cursor.close().catch((err) => log(`Error closing cursor ${err}`));

  if (operations.length) {
    await db.collection('documenttemplates').bulkWrite(operations, { ordered: false });
  }
};

module.exports.down = async function () {
  log('Reverting 1600331796097-setDocumentTemplateDisplayName');
  const db = await connect();
  await db.collection('documenttemplates').updateMany(
    {},
    {
      $unset: {
        displayName: '',
      },
    },
  );
};

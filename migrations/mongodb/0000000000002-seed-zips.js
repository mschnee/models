/**
 * This applies to both development seeds, and test seeds
 */
const fs = require('fs');
const path = require('path');
const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

const csvToJson = require('csvtojson/v1');

const connect = require('../lib/connect');
const seedLocales = require('../mongodb-data/2-seed-locales.json');
module.exports.description = 'Seeds zip codes';

module.exports.up = async function () {
  const db = await connect();
  if (process.env.NODE_ENV === 'test') {
    log('Running 0000000000002-seed-zips');
    await db.collection('locales').insertMany(seedLocales);
  } else if (process.env.NODE_ENV === 'dev') {
    log('Running 0000000000002-seed-zips with full database: this may take several minutes');
    const csv = fs.readFileSync(path.join(__dirname, '../mongodb-data/uszips/v1.6/uszips.csv'), 'utf8');
    const uszips = await new Promise((resolve, reject) => {
      const rows = [];
      csvToJson({ trim: true })
        .fromString(csv)
        .on('json', (json) => rows.push(json))
        .on('done', (err) => {
          if (err) reject(err);
          resolve(rows);
        });
    });

    for (const item of uszips) {
      const { zip, city, lat, lng, state_id: stateId, state_name: stateName, timezone: timeZone } = item;

      const payload = {
        zip: parseInt(zip),
        city,
        lat,
        lng,
        stateId,
        stateName,
        timeZone,
      };

      await db
        .collection('locales')
        .updateOne({ zip: parseInt(zip) }, { $set: payload }, { upsert: true, multi: false });
    }
  }
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  log('Reverting 0000000000002-seed-zips');
  const db = await connect();
  await db.collection('locales').deleteMany({});
};

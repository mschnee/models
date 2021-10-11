const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

const connect = require('../lib/connect');

module.exports.description = 'Adds configuration for Salesforce';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Running 0000000000006-seed-salesforce');
  const db = await connect();
  await db.collection('configurations').insertOne({
    name: 'Salesforce',
    kind: 'Salesforce',
    tokens: {
      id: 'test',
      accessToken:
        '00Dg0000006UHm1!AR4AQCCoy4AVFRsuwI26w.fsnwfi5B8a7T2PRpmdPrfA9XF08kUUOiXnGy1mD7U9xCJVYkzk0D0QyqLKNrzvPwtty0HEg87X',
      refreshToken: '5Aep861O1Hc8GWyS4GAzTrFXR2IKssof9cXdc_bkLuTzh8bnz3ybOJ.OaMQZ3JMRvChhW_VwMK08gak.5hn7uBQ',
      instanceUrl: 'https://bambee--museops.my.salesforce.com',
      tokenType: 'Bearer',
      issuedAt: '1573784077180',
      signature: '9awAtl2YciU/Shzv71HWi/7PMKd7SzM3X+RaK1RiuYg=',
    },
  });
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Reverting 0000000000006-seed-salesforce');
  const db = await connect();
  await db.collection('configurations').deleteOne({
    name: 'Salesforce',
  });
};

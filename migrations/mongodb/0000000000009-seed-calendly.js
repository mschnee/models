const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');

const connect = require('../lib/connect');

module.exports.description = 'Adds configuration for Calendly';

module.exports.up = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Running 0000000000009-seed-calendly');
  const db = await connect();
  if (process.env.NODE_ENV === 'test') {
    await db.collection('configurations').insertOne({
      name: 'Calendly',
      kind: 'Calendly',
      covidEventType: 'covidEventType',
      followUpEventType: 'followUpEventType',
      hrGeneralEventType: 'hrGeneralEventType',
      insuranceOverviewEventType: 'insuranceOverviewEventType',
      personalInsuranceOverviewEventType: 'personalInsuranceOverviewEventType',
      salesEventType: 'salesEventType',
      insuranceTeamUuid: 'insuranceTeamUuid',
      transitionTeamUuid: 'transitionTeamUuid',
      upsellTeamUuid: 'upsellTeamUuid',
    });
  } else if (process.env.NODE_ENV === 'dev') {
    await db.collection('configurations').insertOne({
      name: 'Calendly',
      kind: 'Calendly',
      covidEventType: 'covid-19',
      followUpEventType: 'follow-up',
      hrGeneralEventType: '30min',
      insuranceOverviewEventType: 'jw',
      insuranceTeamUuid: 'AECGBDCIRSNZN2BG',
      personalInsuranceOverviewEventType: 'personal-insurance-overview',
      salesEventType: 'lead-overview-call',
      transitionTeamUuid: 'HAHEFGAUHAAHSI7T',
      upsellTeamUuid: 'HAGGDDBTFWXWDZVQ',
    });
  }
};

module.exports.down = async function () {
  if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test') {
    return;
  }
  if (process.env.SEED !== 'true') {
    return;
  }
  log('Reverting 0000000000009-seed-calendly');
  const db = await connect();
  await db.collection('configurations').deleteOne({
    name: 'Calendly',
  });
};

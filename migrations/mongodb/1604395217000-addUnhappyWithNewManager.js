const debug = require('debug');
const log = debug('bambee:models:mongodb:seed');
const connect = require('../lib/connect');
const _ = require('lodash');

const UNHAPPY_REASON_CODE = 28;

module.exports.description = "Adds 'Unhappy I was assigned to a new HR Manager' to cancellation reasons.";

module.exports.up = async function () {
  log('Running 1604395217000-addUnhappyWithNewManager');
  const db = await connect();
  const cancellationReasons = await db.collection('configurations').findOne({ name: 'CancellationReasons' });

  const serviceIndex = _.findIndex(cancellationReasons.groups, (c) => {
    return c.code === 'service';
  });

  if (serviceIndex) {
    const unhappyReasonIndex = _.findIndex(cancellationReasons.groups[serviceIndex].reasons, (r) => {
      return r.code === UNHAPPY_REASON_CODE;
    });

    if (unhappyReasonIndex === -1) {
      cancellationReasons.groups[serviceIndex].reasons.push({
        code: UNHAPPY_REASON_CODE,
        externalText: 'Unhappy I was assigned to a new HR Manager',
        active: true,
        internalOnly: false,
      });

      await db
        .collection('configurations')
        .findOneAndUpdate({ name: 'CancellationReasons' }, { $set: cancellationReasons });
    }
  }
};

module.exports.down = async function () {
  log('Reverting 1604395217000-addUnhappyWithNewManager');
  const db = await connect();
  const cancellationReasons = await db.collection('configurations').findOne({ name: 'CancellationReasons' });

  const serviceIndex = _.findIndex(cancellationReasons.groups, (c) => {
    return c.code === 'service';
  });

  if (serviceIndex) {
    const unhappyReasonIndex = _.findIndex(cancellationReasons.groups[serviceIndex].reasons, (r) => {
      return r.code === UNHAPPY_REASON_CODE;
    });

    if (unhappyReasonIndex > -1) {
      _.remove(cancellationReasons.groups[serviceIndex].reasons, (r) => {
        return r.code === UNHAPPY_REASON_CODE;
      });

      await db
        .collection('configurations')
        .findOneAndUpdate({ name: 'CancellationReasons' }, { $set: cancellationReasons });
    }
  }
};

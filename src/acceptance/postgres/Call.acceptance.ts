import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { RdsManager } from '../../postgres';
import { Call } from '../../postgres/entities/Call.entity';
import { CallKind } from '../../postgres/entities/CallKind.entity';
import { CallType } from '../../types/calls/CallType';
import { withRdsManager } from './with-rds-manager';

describe('Company', () => {
  let manager: RdsManager;
  let disconnect: Function;
  before(async function () {
    [manager, disconnect] = await withRdsManager();
  });

  after(async () => {
    await disconnect();
  });

  /**
   * This is locked behind process.env.SEED because it makes assumptions about the
   * state of the local database that can only be true when the seed scripts were
   * run.
   */
  it('A Call can be created and retrieved', async () => {
    const callRepo = manager.rwConnection.getRepository(Call);
    let kind = await manager.rwConnection.getRepository(CallKind).findOne({ kind: 'test-call' });
    if (!kind) {
      kind = manager.rwConnection.getRepository(CallKind).create({ kind: 'test-call' });
      await manager.rwConnection.getRepository(CallKind).save(kind);
    }
    const newCall = new Call();
    newCall.callScheduledFor = new Date();
    newCall.companyMongoId = new ObjectId().toHexString();
    newCall.createdAt = new Date();
    newCall.callKind = kind;
    newCall.type = CallType.Default;
    const result = await callRepo.save(newCall);

    const [calls, count] = await callRepo.findAndCount({ id: result.id });
    expect(count).to.equal(1);
  });
});

import { ReturnModelType } from '@typegoose/typegoose';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { ModelManager } from '../../mongodb/ModelManager';
import {PolicyBundle as PolicyBundleSchema} from '../../mongodb/schemas/typegoose/PolicyBundle.schema';
import { withModelManager } from './with-model-manager';

describe('PolicyBundle', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('Can create a PolicyBundle', async () => {
    const PolicyBundle: ReturnModelType<typeof PolicyBundleSchema> = manager.PolicyBundle;

    const result = await (PolicyBundle as any).create({
      name: 'Test Bundle',
      _company: new ObjectId(),
    } as any);
    expect(result._id).to.not.be.undefined;
    expect(ObjectId.isValid(result._id)).to.be.true;
    expect(result.name).to.equal('Test Bundle');

    // Defaults
    expect(Array.isArray(result._policies)).to.be.true;
    expect(result._policies.length).to.equal(0);
    expect(result.isDefault, 'result.isDefault').to.be.false;
    expect(result.createdAt, 'result.createdAt').to.be.instanceOf(Date);
    expect(result.updatedAt, 'result.updatedAt').to.be.null;
    expect(result.publishedAt, 'result.publishedAt').to.be.null;
    expect(result.deletedAt, 'result.deletedAt').to.be.null;
  });
});

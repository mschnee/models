import { expect } from 'chai';
import { ModelManager } from '../../mongodb/ModelManager';
import { withModelManager } from './with-model-manager';

describe('Policy', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('policy can be instantiated', async () => {
    expect(() => {
      new manager.Policy();
    }).not.to.throw;
  });

  it('getStep returns step by name', async () => {
    const policy = new manager.Policy();

    const step = policy.getStep('created');

    expect(step.name).to.equal('created');
  });

  it('completeStep marks step complete and inactive', async () => {
    const policy = new manager.Policy();

    const step = policy.completeStep('requested');

    expect(step.name).to.equal('requested');
    expect(step.active).to.be.false;
  });

  it('activateStep marks step active', async () => {
    const policy = new manager.Policy();

    const step = policy.activateStep('sent');

    expect(step.name).to.equal('sent');
  });

  it('Policy is NOT cancelled when "signed" with 0 associated documents', async () => {
    const policy = new manager.Policy();
    policy.signed({});
    expect(policy.status).not.to.equal('canceled');
    expect(policy.active).to.be.true;
  });
});

import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { ModelManager } from '../../mongodb/ModelManager';
import { CompanyAdvisorRole } from '../../types/company';
import { withModelManager } from './with-model-manager';

describe('CompanyAdvisor', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('Can create a CompanyAdvisor', async function () {
    const CompanyAdvisor = manager.CompanyAdvisor;

    const result = new CompanyAdvisor({
      _advisor: new ObjectId(),
      _company: new ObjectId(),
      role: CompanyAdvisorRole.ACCOUNT_EXECUTIVE,
    });
    await result.save();
    expect(result._id).to.not.be.undefined;
    expect(ObjectId.isValid(result._id)).to.be.true;
  });
});

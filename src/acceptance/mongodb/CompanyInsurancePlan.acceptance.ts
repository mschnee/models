import { ReturnModelType } from '@typegoose/typegoose';
import { expect } from 'chai';
import { ObjectId } from 'mongodb';
import { ModelManager } from '../../mongodb/ModelManager';
import {CompanyInsurancePlan as CompanyInsurancePlanSchema} from '../../mongodb/schemas/typegoose/CompanyInsurancePlan.schema';
import { CompanyInsuranceLineType, CompanyInsurancePlanType } from '../../types/insurance';
import { withModelManager } from './with-model-manager';

describe('CompanyInsurancePlan', () => {
  let manager: ModelManager;
  before(async function () {
    [manager] = await withModelManager();
  });

  it('Can create a CompanyInsurancePlan', async () => {
    const CompanyInsurancePlan: ReturnModelType<typeof CompanyInsurancePlanSchema> = manager.CompanyInsurancePlan;

    const result = await (CompanyInsurancePlan as any).create({
      _company: new ObjectId(),
      lineType: CompanyInsuranceLineType.EmploymentPracticesLiability,
      planType: CompanyInsurancePlanType.Primary,
      _createdBy: new ObjectId(),
    });
    expect(result._id).to.not.be.undefined;
    expect(ObjectId.isValid(result._id)).to.be.true;
  });
});

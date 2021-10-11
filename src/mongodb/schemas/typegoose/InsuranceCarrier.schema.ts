import { index, prop } from '@typegoose/typegoose';
import { CompanyInsuranceLineType } from '../../../types/insurance/CompanyInsuranceLineType';

export class InsuranceCarrierLineType {
  @prop({ enum: Object.values(CompanyInsuranceLineType) })
  lineType: CompanyInsuranceLineType;

  @prop({ default: true })
  canBrokerOfRecord: boolean;
}

@index({ name: 'text' })
export class InsuranceCarrier {
  @prop({ unique: true, index: true })
  name: string;

  @prop({ default: null })
  logoUrl?: string;

  @prop({ default: null })
  carrierUrl?: string;

  @prop({ type: InsuranceCarrierLineType })
  knownLineTypes: InsuranceCarrierLineType[];
}

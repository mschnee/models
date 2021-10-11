import { index, prop, Ref } from '@typegoose/typegoose';
import { CompanyAdvisorRole } from '../../../types/company';

@index({ _company: 1, role: 1 })
export class CompanyAdvisor {
  @prop({ ref: 'Company', index: true })
  _company: Ref<any>;

  @prop({ ref: 'User', index: true })
  _advisor: Ref<any>;

  @prop({ default: false })
  isPrimary?: boolean;

  @prop({ enum: Object.values(CompanyAdvisorRole) })
  role: CompanyAdvisorRole;

  @prop()
  lastUpdatedAt?: Date;

  @prop({ ref: 'User' })
  _lastUpdatedBy?: Ref<any>;
}

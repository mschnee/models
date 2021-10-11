import { prop, Ref } from '@typegoose/typegoose';
import { CompanyAdvisorAssignmentAction } from '../../../types/company/CompanyAdvisorAssignmentAction';
import { CompanyAdvisorRole } from '../../../types/company/CompanyAdvisorRole';

export class CompanyAdvisorAssignmentHistory {
  @prop({ ref: 'Company' })
  _company: Ref<any>;

  @prop({ ref: 'User' })
  _advisor: Ref<any>;

  @prop({ enum: Object.values(CompanyAdvisorAssignmentAction) })
  action: CompanyAdvisorAssignmentAction;

  @prop({ enum: Object.values(CompanyAdvisorRole) })
  role: CompanyAdvisorRole;

  @prop({ default: Date.now })
  date?: Date;

  @prop({ ref: 'User' })
  _by: Ref<any>;
}

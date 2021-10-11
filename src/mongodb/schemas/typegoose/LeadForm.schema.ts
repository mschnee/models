import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import { Documents } from '../../types';

@modelOptions({ options: { allowMixed: 0 } })
class LeadFormData {
  @prop()
  email: string;

  @prop({ type: Schema.Types.Mixed })
  user: Documents.User;

  @prop({ type: Schema.Types.Mixed })
  company: Documents.Company;

  @prop()
  employeeSizeFreeText?: number;

  @prop({ default: false })
  isMultiAccount?: boolean;
}

export class LeadForm {
  @prop({ ref: 'Company' })
  _company?: Ref<any>;

  @prop({ ref: 'User' })
  _user?: Ref<any>;

  @prop()
  salesForceLeadId?: string;

  @prop({ trim: true, lowercase: true, index: true })
  email?: string;

  @prop()
  formData: LeadFormData;

  @prop({ default: Date.now })
  createdAt?: Date;

  @prop({ ref: 'User' })
  _CreatedBy?: Ref<any>;
}
